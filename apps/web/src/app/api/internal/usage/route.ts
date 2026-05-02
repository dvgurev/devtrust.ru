import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { appId, metrics } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                subscriptions: {
                  include: { plan: true },
                },
              },
            },
          },
        },
      },
    })

    const sub = user?.memberships?.find((m) =>
      m.organization?.subscriptions.some((s: any) => s.plan?.appId === appId && s.status === "ACTIVE")
    )?.organization?.subscriptions?.[0]

    if (!sub) {
      return NextResponse.json({ error: "No active subscription" }, { status: 403 })
    }

    const subscriptionId = sub.id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.appUsage.findFirst({
      where: {
        subscriptionId,
        date: today,
      },
    })

    if (existing) {
      const existingMetrics = existing.metrics as Record<string, number>
      const mergedMetrics: Record<string, number> = {}
      
      for (const key in existingMetrics) {
        mergedMetrics[key] = existingMetrics[key]
      }
      for (const key in metrics) {
        mergedMetrics[key] = (mergedMetrics[key] || 0) + ((metrics as Record<string, number>)[key] || 0)
      }

      await prisma.appUsage.update({
        where: { id: existing.id },
        data: { metrics: mergedMetrics as any },
      })
    } else {
      await prisma.appUsage.create({
        data: {
          subscriptionId,
          date: today,
          metrics: metrics as any,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Usage error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}