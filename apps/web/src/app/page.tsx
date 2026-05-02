import { prisma } from "@/lib/prisma"
import { cached, homeCacheKey } from "@/lib/cache"
import HomeClient from "@/components/home-client"

export const revalidate = 600

export const metadata = {
  title: "DevTrust — Бизнес-приложения по подписке",
  description: "Единая платформа для управления бизнес-приложениями. CRM, аналитика, документы — всё в одном месте с прозрачной оплатой за использование.",
}

async function getHomeData() {
  return cached(
    homeCacheKey(),
    async () => {
      const [featuredApps, categories] = await Promise.all([
        prisma.app.findMany({
          where: { featured: true, status: "ACTIVE" },
          take: 3,
          include: {
            category: true,
            plans: { take: 1, orderBy: { price: "asc" } },
          },
          orderBy: { averageRating: "desc" },
        }),
        prisma.appCategory.findMany({
          where: { apps: { some: { status: "ACTIVE" } } },
          include: { _count: { select: { apps: { where: { status: "ACTIVE" } } } } },
          take: 6,
        }),
      ])

      return { featuredApps, categories }
    },
    {
      ttl: 60 * 10,
      tags: ["home", "catalog"],
    }
  )
}

export default async function HomePage() {
  const { featuredApps, categories } = await getHomeData()
  return <HomeClient featuredApps={featuredApps} categories={categories} />
}
