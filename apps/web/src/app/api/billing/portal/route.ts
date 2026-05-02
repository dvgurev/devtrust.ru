import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const returnUrl = body.returnUrl || process.env.SITE_URL || "https://devtrust.ru/dashboard/subscriptions"

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                subscriptions: true,
              },
            },
          },
        },
      },
    })

    let stripeCustomerId: string | null = null

    for (const membership of user?.memberships || []) {
      if (membership.organization.stripeCustomerId) {
        stripeCustomerId = membership.organization.stripeCustomerId
        break
      }
      if (membership.organization.subscriptions.length > 0) {
        const sub = membership.organization.subscriptions[0]
        if (sub.stripeCustomerId) {
          stripeCustomerId = sub.stripeCustomerId
          break
        }
      }
    }

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
