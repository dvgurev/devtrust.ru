import { prisma } from "@/lib/prisma"
import { CatalogClient } from "@/components/catalog-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Каталог приложений — DevTrust",
  description: "Выберите бизнес-приложения для вашей компании",
}

const ITEMS_PER_PAGE = 12

async function getApps(category?: string, query?: string, sort?: string, isFree?: string, page = 1) {
  const where: any = { status: "ACTIVE" }
  
  if (category) {
    where.category = { slug: category }
  }
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }
  if (isFree === "true") {
    where.isFree = true
  }

  const orderBy: any = {}
  if (sort === "newest") {
    orderBy.createdAt = "desc"
  } else if (sort === "price_asc") {
    orderBy.id = "asc"
  } else if (sort === "rating") {
    orderBy.averageRating = "desc"
  } else {
    orderBy.averageRating = "desc"
  }

  const apps = await prisma.app.findMany({
    where,
    include: { 
      category: true,
      plans: { orderBy: { price: "asc" } },
    },
    orderBy,
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
  })

  if (sort === "price_asc") {
    return apps.sort((a, b) => {
      const priceA = a.plans[0]?.price ?? 0
      const priceB = b.plans[0]?.price ?? 0
      return priceA - priceB
    })
  }

  return apps
}

async function getCategories() {
  return prisma.appCategory.findMany({
    orderBy: { sortOrder: "asc" },
  })
}

async function getTotalCount(category?: string, query?: string, isFree?: string) {
  const where: any = { status: "ACTIVE" }
  if (category) {
    where.category = { slug: category }
  }
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }
  if (isFree === "true") {
    where.isFree = true
  }
  return prisma.app.count({ where })
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; query?: string; sort?: string; isFree?: string; page?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const query = params.query
  const sort = params.sort
  const isFree = params.isFree
  const page = parseInt(params.page || "1")
  
  const [apps, categories, total, allAppsCount] = await Promise.all([
    getApps(category, query, sort, isFree, page),
    getCategories(),
    getTotalCount(category, query, isFree),
    prisma.app.count({ where: { status: "ACTIVE" } }),
  ])
  
  return (
    <CatalogClient
      apps={apps}
      categories={categories}
      total={total}
      allAppsCount={allAppsCount}
      category={category}
      query={query}
      sort={sort}
      isFree={isFree}
      currentPage={page}
    />
  )
}