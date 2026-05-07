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
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4 text-fg">Сравнение приложений</h1>
          <p className="font-mono text-sm text-muted mb-4">Выберите приложения для сравнения</p>
          <Link href="/catalog" className="font-mono text-xs uppercase tracking-widest text-accent hover:opacity-80">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  const apps = await getApps(slugs)

  if (apps.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4 text-fg">Приложения не найдены</h1>
          <Link href="/catalog" className="font-mono text-xs uppercase tracking-widest text-accent hover:opacity-80">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl text-fg mb-8">Сравнение приложений</h1>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-border bg-surface">
            <thead>
              <tr>
                <th className="p-4 text-left font-display text-fg border-b-2 border-border w-48">Характеристика</th>
                {apps.map((app) => (
                  <th key={app.id} className="p-4 text-left border-b-2 border-border">
                    <Link href={`/apps/${app.slug}`} className="font-display font-semibold text-fg hover:text-accent">
                      {app.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Категория</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.category?.name || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Цена</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.isFree ? "Бесплатно" : app.plans[0] ? `от ${app.plans[0].price} ₽/мес` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Бесплатное</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.isFree ? "✓" : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Рейтинг</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.averageRating.toFixed(1)} / 5
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Отзывов</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.reviewsCount}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b-2 border-border font-mono text-xs uppercase tracking-widest text-muted">Поддомен</td>
                {apps.map((app) => (
                  <td key={app.id} className="p-4 border-b-2 border-border font-mono text-sm text-fg">
                    {app.subdomain ? `${app.subdomain}.devtrust.ru` : "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link href="/catalog" className="font-mono text-xs uppercase tracking-widest text-accent hover:opacity-80">
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    </div>
  )
}
