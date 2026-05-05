import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  appId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  reviewId: z.string().optional(),
})

function getAccessQuery(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
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
      appAccesses: {
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      },
    },
  })
}

function hasAppAccess(user: any, appId: string): boolean {
  return user?.memberships?.some(
    (m: any) => m.organization?.subscriptions.some(
      (s: any) => s.plan?.appId === appId
    )
  ) || user?.appAccesses?.some(
    (a: any) => a.subscription?.plan?.appId === appId
  )
}

async function updateAppRating(appId: string) {
  const appReviews = await prisma.review.findMany({
    where: { appId, isPublished: true },
  })

  if (appReviews.length > 0) {
    const totalRating = appReviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / appReviews.length
    await prisma.app.update({
      where: { id: appId },
      data: { averageRating, reviewsCount: appReviews.length },
    })
  } else {
    await prisma.app.update({
      where: { id: appId },
      data: { averageRating: 0, reviewsCount: 0 },
    })
  }
}

async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === "ADMIN"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get("appId")
  const sort = searchParams.get("sort") || "newest"
  const ratingFilter = searchParams.get("rating")

  if (!appId) {
    return NextResponse.json({ error: "appId required" }, { status: 400 })
  }

  const where: any = { appId, isPublished: true }
  if (ratingFilter) {
    const r = parseInt(ratingFilter)
    if (r >= 1 && r <= 5) where.rating = r
  }

  const orderBy: any = {}
  switch (sort) {
    case "newest": orderBy.createdAt = "desc"; break
    case "oldest": orderBy.createdAt = "asc"; break
    case "highest": orderBy.rating = "desc"; break
    case "lowest": orderBy.rating = "asc"; break
    default: orderBy.createdAt = "desc"
  }

  const reviews = await prisma.review.findMany({
    where,
    include: { user: true, reply: true },
    orderBy,
    take: 50,
  })

  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 })
    }

    const body = await request.json()
    const { appId, rating, text } = reviewSchema.parse(body)
    const userId = session.user.id

    const isUserAdmin = await isAdmin(userId)
    if (!isUserAdmin) {
      const user = await getAccessQuery(userId)
      if (!hasAppAccess(user, appId)) {
        return NextResponse.json(
          { error: "Вы должны иметь доступ к приложению для оставления отзыва" },
          { status: 403 }
        )
      }
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId, appId },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "Вы уже оставляли отзыв к этому приложению" },
        { status: 400 }
      )
    }

    const shouldPublish = isUserAdmin || isUserAdmin

    const review = await prisma.review.create({
      data: {
        userId,
        appId,
        rating,
        text: text || null,
        isPublished: shouldPublish,
        isModerated: shouldPublish,
      },
    })

    await updateAppRating(appId)

    return NextResponse.json({ success: true, reviewId: review.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Review error:", error)
    return NextResponse.json({ error: "Ошибка при создании отзыва" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 })
    }

    const body = await request.json()
    const { reviewId, rating, text } = z.object({
      reviewId: z.string(),
      rating: z.number().min(1).max(5),
      text: z.string().optional(),
    }).parse(body)

    const userId = session.user.id

    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review || review.userId !== userId) {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 })
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, text: text || null },
    })

    await updateAppRating(review.appId)

    return NextResponse.json({ success: true, review: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Review error:", error)
    return NextResponse.json({ error: "Ошибка при обновлении отзыва" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId required" }, { status: 400 })
    }

    const userId = session.user.id
    const review = await prisma.review.findUnique({ where: { id: reviewId } })

    if (!review || review.userId !== userId) {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 })
    }

    await prisma.review.delete({ where: { id: reviewId } })
    await updateAppRating(review.appId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Ошибка при удалении отзыва" }, { status: 500 })
  }
}
