import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { appId } = body

    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ allowed: false })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                subscriptions: {
                  include: {
                    plan: {
                      include: { app: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const hasAccess = user?.memberships?.some((m) =>
      m.organization?.subscriptions.some(
        (s) => s.plan?.app?.id === appId && s.status === "ACTIVE"
      )
    )

    return NextResponse.json({ allowed: !!hasAccess })
  } catch (error) {
    console.error("Check access error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}