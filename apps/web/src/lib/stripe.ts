import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession({
  customerId,
  customerEmail,
  items,
  period,
  promoCode,
  successUrl,
  cancelUrl,
  metadata,
}: {
  customerId?: string
  customerEmail?: string
  items: { name: string; price: number; quantity: number; appId?: string; planId?: string }[]
  period: "monthly" | "yearly" | "one_time"
  promoCode?: string | null
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const isOneTime = period === "one_time"
  const unitAmount = isOneTime
    ? items.reduce((sum, i) => sum + i.price, 0)
    : period === "yearly"
    ? items.reduce((sum, i) => sum + i.price * 12 * 0.8, 0)
    : items.reduce((sum, i) => sum + i.price, 0)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : customerEmail,
    mode: isOneTime ? "payment" : "subscription",
    line_items: [
      {
        price_data: {
          currency: "rub",
          unit_amount: unitAmount * 100,
          ...(isOneTime ? {} : { recurring: { interval: period === "yearly" ? "year" : "month" } }),
          product_data: {
            name: items.length === 1 
              ? items[0].name 
              : isOneTime 
              ? `Покупка ${items.length} приложений`
              : `Подписка на ${items.length} приложений`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    discounts: promoCode ? [{ coupon: promoCode }] : undefined,
    metadata,
  })

  return session
}

export async function createCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name,
  })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getCustomer(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 })
  return customers.data[0] || null
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}