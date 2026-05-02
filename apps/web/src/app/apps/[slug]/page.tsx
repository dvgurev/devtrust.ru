import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, Download, ExternalLink, Check, Clock, Building2, ArrowRight, ArrowLeft, Filter, Zap, MessageSquare, Calendar, ChevronRight } from "lucide-react"
import { ReviewForm } from "@/components/review-form"
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { AppPageClient } from "@/components/app-page-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const app = await prisma.app.findUnique({
    where: { slug },
    include: { category: true },
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

async function getApp(slug: string) {
  return prisma.app.findUnique({
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
}

async function getUserReview(appId: string) {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.review.findFirst({
    where: { userId: session.user.id, appId },
  })
}

async function getRatingDistribution(appId: string) {
  const reviews = await prisma.review.findMany({
    where: { appId, isPublished: true },
    select: { rating: true },
  })
  const distribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }))
  const total = reviews.length
  return { distribution, total }
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = await getApp(slug)
  
  if (!app) {
    notFound()
  }

  const userReview = await getUserReview(app.id)
  const { distribution, total: totalReviews } = await getRatingDistribution(app.id)

  return (
    <AppPageClient
      app={app}
      userReview={userReview ? { id: userReview.id, rating: userReview.rating, text: userReview.text } : null}
      distribution={distribution}
      totalReviews={totalReviews}
    />
  )
}