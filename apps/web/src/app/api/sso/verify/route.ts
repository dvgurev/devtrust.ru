import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const ssoToken = await prisma.sSOToken.findUnique({
      where: { accessToken: token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        app: true,
      },
    })

    if (!ssoToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (ssoToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }

    return NextResponse.json({
      user: ssoToken.user,
      organization: ssoToken.organization,
      appId: ssoToken.appId,
      expiresAt: ssoToken.expiresAt.getTime(),
    })
  } catch (error) {
    console.error("SSO verify error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}