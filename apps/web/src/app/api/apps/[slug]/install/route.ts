import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log('[/api/apps/[slug]/install] Request received')
    const session = await auth()
    console.log('Session:', session?.user?.id ? 'authenticated' : 'unauthenticated')
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    console.log('Slug from params:', slug)

    const app = await prisma.app.findUnique({
      where: { slug },
    })

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    if (!app.isFree) {
      return NextResponse.json({ error: "App is not free" }, { status: 400 })
    }

    const userId = session.user.id

    // Create a simple record for user-app connection (no organization needed)
    // We'll create a special "free" subscription entry just to track this
    const plan = await prisma.plan.findFirst({
      where: { appId: app.id },
      orderBy: { price: "asc" },
    })

    if (!plan) {
      return NextResponse.json({ error: "No plan found" }, { status: 400 })
    }

    // Check if already has access
    const existingAccess = await prisma.appAccess.findFirst({
      where: {
        userId: userId,
        subscription: {
          planId: plan.id,
          status: "ACTIVE",
        },
      },
    })

    if (existingAccess) {
      const redirectUrl = app.subdomain
        ? `https://${app.subdomain}.devtrust.ru`
        : (app as any).externalUrl || `/apps/${app.slug}`
      return NextResponse.json({
        error: "App already installed",
        redirect: redirectUrl
      }, { status: 400 })
    }

    // Get or create user organization for subscription record
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let organization = user.memberships?.[0]?.organization

    // Create organization if doesn't exist
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: `${user.name || "Пользователь"} - организация`,
          slug: `user-${user.id.slice(0, 8)}`,
        },
      })

      await prisma.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
        },
      })
    }

    // Create subscription for free app
    const subscription = await prisma.subscription.create({
      data: {
        organizationId: organization!.id,
        planId: plan.id,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        stripeSubscriptionId: "free_" + Date.now(),
      },
    })

    // Create access for user
    await prisma.appAccess.create({
      data: {
        subscriptionId: subscription.id,
        userId: userId,
      },
    })

    const redirectUrl = app.subdomain
      ? `https://${app.subdomain}.devtrust.ru`
      : (app as any).externalUrl || `/apps/${app.slug}`

    return NextResponse.json({ 
      success: true, 
      redirect: redirectUrl 
    })
  } catch (error) {
    console.error("Error installing free app:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}