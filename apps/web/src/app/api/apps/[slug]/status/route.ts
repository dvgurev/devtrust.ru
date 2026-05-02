import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ installed: false })
    }

    const { slug } = await params

    const app = await prisma.app.findUnique({
      where: { slug },
    })

    if (!app) {
      return NextResponse.json({ installed: false })
    }

    // Find the plan for this app
    const plan = await prisma.plan.findFirst({
      where: { appId: app.id },
      orderBy: { price: "asc" },
    })

    if (!plan) {
      return NextResponse.json({ installed: false })
    }

    // Check if user has access to this app
    const hasAccess = await prisma.appAccess.findFirst({
      where: {
        userId: session.user.id,
        subscription: {
          status: "ACTIVE",
          planId: plan.id,
        },
      },
    })

    const redirectUrl = app.subdomain 
      ? `https://${app.subdomain}.devtrust.ru` 
      : app.externalUrl || `/apps/${app.slug}`

    return NextResponse.json({ 
      installed: !!hasAccess,
      redirect: hasAccess ? redirectUrl : null
    })
  } catch (error) {
    console.error("Error checking app access:", error)
    return NextResponse.json({ installed: false })
  }
}