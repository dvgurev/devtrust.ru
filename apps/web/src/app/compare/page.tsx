import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const metadata = {
  title: "Сравнение приложений — DevTrust",
  description: "Сравнение бизнес-приложений по характеристикам",
}

async function getApps(slugs: string[]) {
  return prisma.app.findMany({
    where: { slug: { in: slugs }, status: "ACTIVE" },
    include: { 
      category: true,
      plans: { orderBy: { price: "asc" } },
    },
  })
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ apps?: string }>
}) {
  const params = await searchParams
  const slugs = params.apps?.split(",").filter(Boolean) || []
  
  if (slugs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Сравнение приложений</h1>
          <p className="text-gray-600 mb-4">Выберите приложения для сравнения</p>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  const apps = await getApps(slugs)

  if (apps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Приложения не найдены</h1>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Сравнение приложений</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left bg-gray-50 w-48">Характеристика</th>
                {apps.map((app) => (
                  <th key={app.id} className="p-4 text-left">
                    <Link href={`/apps/${app.slug}`} className="font-semibold hover:text-blue-600">
                      {app.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-t bg-gray-50">Категория</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.category?.name || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-t bg-gray-50">Цена</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.isFree ? "Бесплатно" : app.plans[0] ? `от ${app.plans[0].price} ₽/мес` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-t bg-gray-50">Бесплатное</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.isFree ? "✓" : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-t bg-gray-50">Рейтинг</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.averageRating.toFixed(1)} / 5
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-t bg-gray-50">Отзывов</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.reviewsCount}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-t bg-gray-50">Поддомен</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-t">
                    {app.subdomain ? `${app.subdomain}.devtrust.ru` : "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link href="/catalog" className="text-blue-600 hover:underline">
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    </div>
  )
}