import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle, ExternalLink, AppWindow, ArrowUpRight,
  Sparkles, LayoutDashboard, ShoppingBag, PartyPopper
} from "lucide-react"

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
    <div className="min-h-[80vh] bg-[#f5f5f5] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-neutral-100 p-8 lg:p-10">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight mb-2">
            Оплата прошла успешно!
          </h1>
          <p className="text-neutral-500">
            Ваша подписка активирована
          </p>
        </div>

        {/* Purchased Apps */}
        {purchasedApps.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="font-bold text-neutral-900">
                {purchasedApps.length === 1
                  ? "Приложение"
                  : "Приложения"}
              </h2>
            </div>

            <div className="space-y-3">
              {purchasedApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl
                    border border-neutral-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0
                      border border-neutral-100">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={app.name} className="w-6 h-6 rounded-lg" />
                      ) : (
                        <AppWindow className="w-5 h-5 text-neutral-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{app.name}</p>
                      {app.description && (
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          {app.description.slice(0, 60)}...
                        </p>
                      )}
                    </div>
                  </div>

                  {app.subdomain && (
                    <a
                      href={`https://${app.subdomain}.devtrust.ru`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white 
                        rounded-xl font-medium text-sm hover:bg-neutral-800 
                        transition-all duration-300 flex-shrink-0 ml-3"
                    >
                      Открыть
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 
              bg-neutral-900 text-white rounded-2xl font-bold
              hover:bg-neutral-800 transition-all duration-300 group"
          >
            <LayoutDashboard className="w-5 h-5" />
            Перейти в дашборд
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 
              border-2 border-neutral-200 text-neutral-700 rounded-2xl font-bold
              hover:bg-neutral-50 transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            Продолжить покупки
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Чек отправлен на ваш email. По вопросам:{" "}
          <a href="mailto:support@devtrust.ru" className="text-violet-600 hover:text-violet-700">
            support@devtrust.ru
          </a>
        </p>
      </div>
    </div>
  )
}