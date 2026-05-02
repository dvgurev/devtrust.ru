import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession, createCustomer } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { z } from "zod"

const checkoutSchema = z.object({
  items: z.array(z.object({
    appId: z.string(),
    appSlug: z.string(),
    appName: z.string(),
    planId: z.string(),
    planName: z.string(),
    price: z.number(),
  })),
  period: z.enum(["monthly", "yearly"]),
  promoCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, period } = checkoutSchema.parse(body)

    const session = await auth()
    const isAuthenticated = !!session?.user
    let customerId: string | undefined
    let organizationId: string = ""

    if (isAuthenticated && session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          memberships: {
            include: { organization: true },
          },
        },
      })

      if (user?.memberships?.[0]?.organization) {
        const org = user.memberships[0].organization
        organizationId = org.id
        if (org.stripeCustomerId) {
          customerId = org.stripeCustomerId
        } else if (user.email) {
          const newCustomer = await createCustomer(user.email, user.name || undefined)
          customerId = newCustomer.id
          await prisma.organization.update({
            where: { id: org.id },
            data: { stripeCustomerId: customerId },
          })
        }
      }
    }

    const lineItems = items.map((item) => ({
      name: item.appName,
      price: item.price,
      quantity: 1,
      appId: item.appId,
      planId: item.planId,
    }))

    const baseUrl = process.env.SITE_URL || "https://devtrust.ru"

    const checkout = await createCheckoutSession({
      customerId,
      customerEmail: isAuthenticated ? session?.user?.email ?? undefined : undefined,
      items: lineItems,
      period,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/cart`,
      metadata: {
        organizationId,
        items: JSON.stringify(items),
        period,
      },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    )
  }
}