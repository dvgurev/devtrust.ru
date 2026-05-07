// apps/[slug]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { AppPageClient } from "@/components/app-page-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const app = await prisma.app.findUnique({
    where: { slug },
    select: { name: true, description: true, iconUrl: true, slug: true },
  })

  if (!app) return { title: "Приложение не найдено" }

  return {
    title: `${app.name} — DevTrust`,
    description: app.description || undefined,
    openGraph: {
      title: app.name,
      description: app.description || undefined,
      type: "website",
      url: `https://devtrust.ru/apps/${app.slug}`,
      images: app.iconUrl ? [{ url: app.iconUrl }] : [],
    },
  }
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Единый запрос всех данных
  const app = await prisma.app.findUnique({
    where: { slug },
    include: {
      category: true,
      plans: { orderBy: { price: "asc" } },
      screenshots: { orderBy: { sortOrder: "asc" } },
      changelogs: { orderBy: { releasedAt: "desc" }, take: 5 },
      reviews: {
        where: { isPublished: true },
        include: { user: true, reply: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!app) {
    notFound()
  }

  // Получаем отзыв пользователя и распределение рейтинга
  const session = await auth()
  let userReview = null
  let distribution: { rating: number; count: number }[] = []
  let totalReviews = 0

  if (session?.user?.id) {
    const review = await prisma.review.findFirst({
      where: { userId: session.user.id, appId: app.id },
    })
    if (review) {
      userReview = { id: review.id, rating: review.rating, text: review.text }
    }
  }

  const allRatings = await prisma.review.findMany({
    where: { appId: app.id, isPublished: true },
    select: { rating: true },
  })

  distribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: allRatings.filter((rev) => rev.rating === r).length,
  }))
  totalReviews = allRatings.length

  // Сериализация данных
  const serializedApp = JSON.parse(JSON.stringify({
    ...app,
    averageRating: Number(app.averageRating),
    plans: app.plans.map(p => ({ ...p, price: Number(p.price) })),
  }))

  return (
    <AppPageClient
      app={serializedApp}
      userReview={userReview}
      distribution={distribution}
      totalReviews={totalReviews}
    />
  )
}