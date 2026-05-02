import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cached, catalogCacheKey } from "@/lib/cache"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const category = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || ""
  const isFree = searchParams.get("isFree") || ""

  if (!query.trim()) {
    return NextResponse.json({ apps: [] })
  }

  // Генерируем ключ кэша
  const cacheKey = catalogCacheKey({ query, category, sort, isFree, limit: 20 })

  // Используем кэшированную функцию
  const result = await cached(
    cacheKey,
    async () => {
      const where: any = { status: "ACTIVE" }
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
      
      if (category) {
        where.category = { slug: category }
      }
      if (isFree === "true") {
        where.isFree = true
      }

      const orderBy: any = { averageRating: "desc" }
      if (sort === "newest") {
        orderBy.createdAt = "desc"
      }

      const apps = await prisma.app.findMany({
        where,
        include: {
          category: true,
          plans: { take: 1, orderBy: { price: "asc" } },
        },
        orderBy,
        take: 20,
      })

      return { apps }
    },
    {
      ttl: 60 * 2, // 2 минуты для поисковых запросов
      tags: ["catalog", "search"],
    }
  )

  return NextResponse.json(result)
}