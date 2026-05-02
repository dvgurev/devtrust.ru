import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ExternalLink, AppWindow } from "lucide-react"

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await props.searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    return redirect("/cart")
  }

  type AppType = {
    id: string
    name: string
    slug: string
    description: string | null
    subdomain: string | null
    iconUrl: string | null
  }

  type SubWithPlan = {
    id: string
    status: string
    plan: {
      app: AppType
    }
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { stripeSubscriptionId: sessionId },
    include: { plan: { include: { app: true } } },
    take: 5,
  }) as SubWithPlan[]

  const purchasedApps = subscriptions
    .filter((s) => s.status === "ACTIVE")
    .map((s) => s.plan?.app)
    .filter(Boolean) as AppType[]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Спасибо за заказ!</h1>
            <p className="text-gray-600">
              Ваша подписка успешно активирована
            </p>
          </div>

          {purchasedApps.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold mb-4">Купленные приложения:</h2>
              <div className="space-y-3">
                {purchasedApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <AppWindow className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-sm text-gray-500">
                          {app.description?.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                    {app.subdomain && (
                      <a
                        href={`https://${app.subdomain}.devtrust.ru`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        Открыть <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Перейти в дашборд
            </Link>
            <Link
              href="/catalog"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}