import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type { SubscriptionStatus } from "@prisma/client"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const processedEvents = new Map<string, number>()
const EVENT_TTL = 60 * 60 * 1000

function isEventProcessed(eventId: string): boolean {
  const timestamp = processedEvents.get(eventId)
  if (!timestamp) return false
  if (Date.now() - timestamp > EVENT_TTL) {
    processedEvents.delete(eventId)
    return false
  }
  return true
}

async function createNotification(userId: string, type: string, title: string, text: string) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, text },
    })
  } catch {
    console.error("Failed to create notification")
  }
}

async function handleCheckoutCompleted(session: any) {
  const subscriptionId = session.subscription
  const organizationId = session.metadata?.organizationId
  const itemsJson = session.metadata?.items

  if (!subscriptionId || !organizationId || !itemsJson) {
    console.error("Missing metadata in checkout session:", {
      subscriptionId: !!subscriptionId,
      organizationId: !!organizationId,
      itemsJson: !!itemsJson,
    })
    return
  }

  const items = JSON.parse(itemsJson)
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as any

  for (const item of items) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        organizationId,
        planId: item.planId,
        stripeSubscriptionId: subscriptionId,
      },
    })

    if (existingSubscription) {
      console.log("Subscription already exists, skipping:", existingSubscription.id)
      continue
    }

    const plan = await prisma.plan.findUnique({
      where: { id: item.planId },
    })

    if (!plan) {
      console.error("Plan not found:", item.planId)
      continue
    }

    const periodEnd = new Date(stripeSub.current_period_end * 1000)

    await prisma.subscription.create({
      data: {
        organizationId,
        planId: item.planId,
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: session.customer || stripeSub.customer,
      },
    })

    console.log(`Created subscription for plan ${plan.name}`)
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: { stripeCustomerId: session.customer },
  })
}

async function handleSubscriptionUpdated(subscription: any) {
  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!existingSub) {
    console.error("Subscription not found in DB:", subscription.id)
    return
  }

  const statusMap: Record<string, SubscriptionStatus> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    unpaid: "PAST_DUE",
    trialing: "ACTIVE",
  }

  const newStatus = statusMap[subscription.status] || "ACTIVE"
  const periodEnd = new Date(subscription.current_period_end * 1000)

  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: {
      status: newStatus,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })

  console.log(`Updated subscription ${existingSub.id} to ${newStatus}`)
}

async function handleSubscriptionDeleted(subscription: any) {
  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!existingSub) {
    console.error("Subscription not found in DB:", subscription.id)
    return
  }

  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: { status: "CANCELED" },
  })

  const org = await prisma.organization.findUnique({
    where: { id: existingSub.organizationId },
    include: {
      memberships: {
        include: { user: true },
      },
    },
  })

  if (org) {
    const app = await prisma.app.findFirst({
      where: { plans: { some: { id: existingSub.planId } } },
    })

    for (const member of org.memberships) {
      await createNotification(
        member.userId,
        "subscription_canceled",
        "Подписка отменена",
        `Подписка на ${app?.name || "приложение"} была отменена`
      )
    }
  }

  console.log(`Canceled subscription ${existingSub.id}`)
}

async function handleInvoicePaid(invoice: any) {
  const stripeInvoiceId = invoice.id
  const stripeSubscriptionId = invoice.subscription

  if (!stripeSubscriptionId) return

  const existingInvoice = await prisma.invoice.findFirst({
    where: { stripeInvoiceId },
  })

  if (existingInvoice) {
    console.log("Invoice already exists, skipping:", existingInvoice.id)
    return
  }

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  })

  if (!existingSub) return

  const amount = invoice.amount_paid || invoice.amount_due || 0
  const currency = (invoice.currency || "RUB").toUpperCase()

  await prisma.invoice.create({
    data: {
      organizationId: existingSub.organizationId,
      subscriptionId: existingSub.id,
      amount,
      currency,
      status: "PAID",
      stripeInvoiceId,
      pdfUrl: invoice.invoice_pdf || null,
      paidAt: new Date(invoice.status_transitions?.paid_at * 1000 || Date.now()),
    },
  })

  console.log(`Created paid invoice ${stripeInvoiceId}`)
}

async function handleInvoicePaymentFailed(invoice: any) {
  const stripeInvoiceId = invoice.id
  const stripeSubscriptionId = invoice.subscription

  if (!stripeSubscriptionId) return

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  })

  if (!existingSub) return

  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: { status: "PAST_DUE" },
  })

  const org = await prisma.organization.findUnique({
    where: { id: existingSub.organizationId },
    include: { memberships: { include: { user: true } } },
  })

  if (org) {
    const app = await prisma.app.findFirst({
      where: { plans: { some: { id: existingSub.planId } } },
    })

    for (const member of org.memberships) {
      await createNotification(
        member.userId,
        "payment_failed",
        "Ошибка оплаты",
        `Не удалось оплатить подписку на ${app?.name || "приложение"}`
      )
    }
  }

  console.log(`Payment failed for subscription ${existingSub.id}`)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !webhookSecret) {
    console.error("Webhook: missing signature or secret")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (isEventProcessed(event.id)) {
      console.log("Event already processed:", event.id)
      return NextResponse.json({ received: true })
    }

    console.log(`Processing webhook event: ${event.type} (${event.id})`)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        await handleCheckoutCompleted(session)
        break
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        await handleSubscriptionUpdated(subscription)
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        await handleSubscriptionDeleted(subscription)
        break
      }
      case "invoice.paid": {
        const invoice = event.data.object as any
        await handleInvoicePaid(invoice)
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as any
        await handleInvoicePaymentFailed(invoice)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    processedEvents.set(event.id, Date.now())

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
