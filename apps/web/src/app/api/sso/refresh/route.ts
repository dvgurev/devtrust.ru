import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 400 })
    }

    const ssoToken = await prisma.sSOToken.findUnique({
      where: { refreshToken },
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
      },
    })

    if (!ssoToken) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    const newAccessToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.sSOToken.update({
      where: { id: ssoToken.id },
      data: {
        accessToken: newAccessToken,
        expiresAt,
      },
    })

    return NextResponse.json({
      user: ssoToken.user,
      organization: ssoToken.organization,
      accessToken: newAccessToken,
      expiresAt: expiresAt.getTime(),
    })
  } catch (error) {
    console.error("SSO refresh error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}