import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const app = await prisma.app.findUnique({
      where: { slug, isExternal: true },
      include: {
        externalConfig: true,
      },
    })

    if (!app) {
      return NextResponse.json({ allowed: false, error: "App not found" }, { status: 404 })
    }

    if (app.status !== "ACTIVE") {
      return NextResponse.json({ allowed: false, error: "App not available" }, { status: 403 })
    }

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ allowed: false }, { status: 401 })
    }

    const hasAccess = await prisma.appAccess.findFirst({
      where: {
        userId: session.user.id,
        subscription: {
          status: "ACTIVE",
          plan: {
            appId: app.id,
          },
        },
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ allowed: false }, { status: 403 })
    }

    return NextResponse.json({
      allowed: true,
      app: {
        id: app.id,
        name: app.name,
        slug: app.slug,
        externalUrl: app.externalUrl,
        customDomain: app.customDomain,
        iconUrl: app.iconUrl,
      },
    })
  } catch (error) {
    console.error("External access error:", error)
    return NextResponse.json({ allowed: false, error: "Internal error" }, { status: 500 })
  }
}