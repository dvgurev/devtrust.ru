import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { appId, redirectUrl } = await request.json()

    if (!appId) {
      return NextResponse.json({ error: "App ID required" }, { status: 400 })
    }

    const app = await prisma.app.findUnique({
      where: { id: appId, isExternal: true },
      include: {
        externalConfig: true,
      },
    })

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
      orderBy: { createdAt: "asc" },
    })

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    const currentOrg = membership.organizationId

    const accessToken = randomBytes(32).toString("hex")
    const refreshToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const ssoToken = await prisma.sSOToken.create({
      data: {
        userId: session.user.id as string,
        organizationId: currentOrg,
        appId: app.id,
        accessToken,
        refreshToken,
        expiresAt,
      },
    })

    const returnUrl = new URL(redirectUrl || app.externalUrl || `https://${app.slug}.devtrust.ru`)
    returnUrl.searchParams.set("token", accessToken)

    return NextResponse.json({
      success: true,
      redirectUrl: returnUrl.toString(),
    })
  } catch (error) {
    console.error("SSO init error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}