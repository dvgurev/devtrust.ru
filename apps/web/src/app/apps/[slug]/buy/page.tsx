import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { createCheckoutSession, createCustomer } from "@/lib/stripe"
import { BuyPageClient } from "@/components/buy-page-client"

export default async function BuyAppPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ plan?: string }>
}) {
  const { slug } = await params
  const { plan: planSlug } = await searchParams
  
  const session = await auth()
  if (!session?.user) {
    const redirectUrl = `/apps/${slug}/buy${planSlug ? `?plan=${planSlug}` : ""}`
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
  }

  const app = await prisma.app.findUnique({
    where: { slug },
    include: {
      category: true,
      plans: { orderBy: { price: "asc" } },
    },
  })

  if (!app) {
    notFound()
  }

  // Бесплатные приложения - перенаправляем обратно на страницу приложения
  if (app.isFree || !app.plans || app.plans.length === 0) {
    redirect(`/apps/${slug}`)
  }

  const selectedPlan = planSlug
    ? app.plans.find((p) => p.slug === planSlug)
    : app.plans[0]

  if (!selectedPlan || !app.name) {
    notFound()
  }

  // TypeScript guard
  const appName = app.name
  const appPlans = app.plans

  const baseUrl = process.env.SITE_URL || "https://devtrust.ru"

  async function handleBuyAction(period: string, price: number) {
    "use server"
    if (!session?.user?.email || !selectedPlan || !appName) return

    const periodLabel = period === "yearly" ? "за год" : period === "oneTime" ? "разово" : "в месяц"
    
    let customerId: string | undefined
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { memberships: { include: { organization: true } } }
    })
    
    if (user?.memberships?.[0]?.organization) {
      const org = user.memberships[0].organization
      if (org.stripeCustomerId) {
        customerId = org.stripeCustomerId
      } else if (user.email) {
        const newCustomer = await createCustomer(user.email, user.name || undefined)
        customerId = newCustomer.id
        await prisma.organization.update({
          where: { id: org.id },
          data: { stripeCustomerId: customerId }
        })
      }
    }

    const checkoutPeriod: "monthly" | "yearly" | "one_time" = period === "oneTime" ? "one_time" : period as "monthly" | "yearly"
    const checkout = await createCheckoutSession({
      customerId,
      customerEmail: session.user.email ?? undefined,
      items: [{ name: `${appName} - ${selectedPlan.name} (${periodLabel})`, price, quantity: 1 }],
      period: checkoutPeriod,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/apps/${slug}`,
    })

    if (checkout.url) {
      redirect(checkout.url)
    }
  }

  return (
    <BuyPageClient
      app={app}
      plans={appPlans}
      selectedPlan={selectedPlan}
      handleBuy={handleBuyAction}
    />
  )
}