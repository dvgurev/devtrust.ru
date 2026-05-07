import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  CreditCard, Calendar, AppWindow, ExternalLink, ArrowRight,
  Sparkles, AlertCircle, Check, Settings, Package, Shield,
  ArrowUpRight, Clock, XCircle
} from "lucide-react"
import { SubscriptionEditModal } from "@/components/subscription-edit-modal"
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button"

export default async function DashboardSubscriptionsPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              subscriptions: {
                include: {
                  plan: { include: { app: true } },
                },
              },
            },
          },
        },
      },
    },
  }) as any

  const subscriptions = user?.memberships?.flatMap((m: any) => m.organization?.subscriptions || []) || []

  const activeCount = subscriptions.filter((s: any) => s.status === "ACTIVE").length
  const expiringSoonCount = subscriptions.filter((s: any) => {
    const end = s.currentPeriodEnd
    if (!end) return false
    const days = Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days <= 7 && days > 0
  }).length
  const monthlyTotal = subscriptions.reduce((sum: number, s: any) => sum + (s.plan?.price || 0), 0)

  const firstSubscription = subscriptions[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Подписки
          </h1>
          <p className="text-neutral-500 mt-1">
            Управляйте своими подписками и платежами
          </p>
        </div>
        <div className="flex gap-3">
          {firstSubscription && (
            <Link
              href={`/dashboard/subscriptions/${firstSubscription.id}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
                rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              Управление подписками
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Добавить
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      {subscriptions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-neutral-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-neutral-900">{activeCount}</div>
                <div className="text-xs text-neutral-400">Активных</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-neutral-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-neutral-900">{expiringSoonCount}</div>
                <div className="text-xs text-neutral-400">Истекают скоро</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-neutral-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-neutral-900">
                  {monthlyTotal.toLocaleString("ru")} ₽
                </div>
                <div className="text-xs text-neutral-400">В месяц</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            У вас пока нет подписок
          </h3>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Подпишитесь на приложения для управления вашим бизнесом
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
              rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Открыть каталог
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub: any) => {
            const app = sub.plan?.app
            const periodEnd = sub.currentPeriodEnd
            const daysLeft = periodEnd
              ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null
            const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
            const isExpired = daysLeft !== null && daysLeft < 0

            const allPlans = app?.plans?.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              slug: p.slug,
              features: p.features as string[] | null,
            })) || []

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-neutral-100 p-6
                  hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* App Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {app?.iconUrl ? (
                        <img src={app.iconUrl} alt={app.name} className="w-7 h-7 rounded-lg" />
                      ) : (
                        <AppWindow className="w-6 h-6 text-neutral-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        {app?.name || "Приложение"}
                      </h3>
                      <p className="text-sm text-neutral-500">{sub.plan?.name}</p>
                    </div>
                  </div>

                  {/* Price & Status */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">
                        {sub.plan?.price > 0
                          ? `${sub.plan.price.toLocaleString("ru")} ₽/мес`
                          : "Бесплатно"}
                      </p>
                      {sub.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          Активна
                        </span>
                      ) : sub.status === "CANCELED" ? (
                        <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Отменена
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Неактивна
                        </span>
                      )}
                    </div>

                    {/* Period */}
                    <div className="text-sm text-neutral-500">
                      {periodEnd ? (
                        isExpired ? (
                          <span className="text-red-600 font-medium">
                            Истекла {new Date(periodEnd).toLocaleDateString("ru")}
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="text-amber-600 font-medium">
                            Истекает через {daysLeft} дн.
                          </span>
                        ) : (
                          <span>До {new Date(periodEnd).toLocaleDateString("ru")}</span>
                        )
                      ) : (
                        <span>Бессрочно</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/apps/${app?.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 
                        bg-neutral-900 text-white rounded-xl font-medium text-sm
                        hover:bg-neutral-800 transition-all duration-300"
                    >
                      Открыть
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Управление конкретной подпиской */}
                    <Link
                      href={`/dashboard/subscriptions/${sub.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 
                        border border-neutral-200 text-neutral-500 rounded-xl
                        hover:bg-neutral-50 hover:text-neutral-700 transition-all duration-300"
                      title="Управление подпиской"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>

                    {/* Модалка смены тарифа */}
                    <SubscriptionEditModal
                      subscriptionId={sub.id}
                      currentPlanId={sub.plan?.id}
                      plans={allPlans}
                    />

                    {/* Кнопка отмены подписки */}
                    {sub.status === "ACTIVE" && (
                      <CancelSubscriptionButton
                        subscriptionId={sub.id}
                        appName={app?.name || "Приложение"}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Help */}
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-violet-500" />
              <h3 className="font-bold text-violet-900">Нужна помощь?</h3>
            </div>
            <p className="text-violet-700 text-sm max-w-lg">
              Свяжитесь с поддержкой для решения любых вопросов по подпискам и платежам.
            </p>
          </div>
          <Link
            href="/docs/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
              rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300
              flex-shrink-0"
          >
            Связаться с поддержкой
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}