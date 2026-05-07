// apps/web/src/app/dashboard/subscriptions/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, Calendar, AppWindow, ExternalLink, Sparkles, AlertCircle, Check, Settings, Shield, ArrowUpRight, Clock, XCircle } from "lucide-react"
import { SubscriptionEditModal } from "@/components/subscription-edit-modal"
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button"

export default async function DashboardSubscriptionsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { memberships: { include: { organization: { include: { subscriptions: { include: { plan: { include: { app: true } } } } } } } } },
  }) as any

  const subscriptions = user?.memberships?.flatMap((m: any) => m.organization?.subscriptions || []) || []
  const activeCount = subscriptions.filter((s: any) => s.status === "ACTIVE").length
  const expiringSoonCount = subscriptions.filter((s: any) => {
    const end = s.currentPeriodEnd; if (!end) return false
    return Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7
  }).length
  const monthlyTotal = subscriptions.reduce((sum: number, s: any) => sum + (s.plan?.price || 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Подписки</h1>
          <p className="text-neutral-500 text-sm mt-1">Управляйте подписками и платежами</p>
        </div>
        <div className="flex gap-2">
          {subscriptions[0] && (
            <Link href={`/dashboard/subscriptions/${subscriptions[0].id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-5 lg:py-3 bg-neutral-900 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-neutral-800 transition-all">
              <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Управление
            </Link>
          )}
          <Link href="/catalog"
            className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-5 lg:py-3 bg-neutral-900 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-neutral-800 transition-all">
            <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Добавить
          </Link>
        </div>
      </div>

      {/* Stats */}
      {subscriptions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {[
            { label: "Активных", value: activeCount, icon: Check, color: "emerald" },
            { label: "Истекают", value: expiringSoonCount, icon: Clock, color: "amber" },
            { label: "В месяц", value: `${monthlyTotal.toLocaleString("ru")} ₽`, icon: CreditCard, color: "blue" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-3 lg:p-6">
              <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-400 mb-1.5 lg:mb-3" />
              <div className="text-lg lg:text-2xl font-black text-neutral-900">{stat.value}</div>
              <div className="text-[10px] lg:text-xs text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-12 lg:py-16 bg-white rounded-2xl lg:rounded-3xl border border-neutral-100">
          <CreditCard className="w-10 h-10 lg:w-12 lg:h-12 text-neutral-300 mx-auto mb-3 lg:mb-4" />
          <h3 className="text-lg lg:text-xl font-bold text-neutral-900 mb-2">Нет подписок</h3>
          <p className="text-neutral-500 text-sm mb-6">Подпишитесь на приложения из каталога</p>
          <Link href="/catalog" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
            <Sparkles className="w-4 h-4" /> Открыть каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {subscriptions.map((sub: any) => {
            const app = sub.plan?.app
            const periodEnd = sub.currentPeriodEnd
            const daysLeft = periodEnd ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
            const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
            const isExpired = daysLeft !== null && daysLeft < 0
            const allPlans = app?.plans?.map((p: any) => ({ id: p.id, name: p.name, price: Number(p.price), slug: p.slug, features: p.features as string[] | null })) || []

            return (
              <div key={sub.id} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                      {app?.iconUrl ? <img src={app.iconUrl} className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg" /> : <AppWindow className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm lg:text-base">{app?.name}</h3>
                      <p className="text-xs lg:text-sm text-neutral-500">{sub.plan?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 text-sm lg:text-base">{sub.plan?.price > 0 ? `${sub.plan.price.toLocaleString("ru")} ₽/мес` : "Бесплатно"}</p>
                      <span className={`inline-flex items-center gap-1 text-xs lg:text-sm font-medium ${sub.status === "ACTIVE" ? "text-emerald-600" : sub.status === "CANCELED" ? "text-amber-600" : "text-red-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> {sub.status === "ACTIVE" ? "Активна" : sub.status === "CANCELED" ? "Отменена" : "Неактивна"}
                      </span>
                    </div>
                    <div className="text-xs lg:text-sm text-neutral-500 hidden sm:block">
                      {periodEnd ? (isExpired ? <span className="text-red-600">Истекла</span> : isExpiringSoon ? <span className="text-amber-600">Через {daysLeft} дн.</span> : <span>До {new Date(periodEnd).toLocaleDateString("ru")}</span>) : <span>Бессрочно</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link href={`/apps/${app?.slug}`} className="inline-flex items-center gap-1 px-3 py-2 lg:px-4 lg:py-2.5 bg-neutral-900 text-white rounded-xl font-medium text-xs lg:text-sm hover:bg-neutral-800">Открыть</Link>
                    <Link href={`/dashboard/subscriptions/${sub.id}`} className="p-2 border border-neutral-200 text-neutral-500 rounded-xl hover:bg-neutral-50"><Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" /></Link>
                    <SubscriptionEditModal subscriptionId={sub.id} currentPlanId={sub.plan?.id} plans={allPlans} />
                    {sub.status === "ACTIVE" && <CancelSubscriptionButton subscriptionId={sub.id} appName={app?.name || "Приложение"} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Help */}
      <div className="mt-4 lg:mt-6 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5"><Shield className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" /><h3 className="font-bold text-violet-900 text-sm lg:text-base">Нужна помощь?</h3></div>
            <p className="text-violet-700 text-xs lg:text-sm">Свяжитесь с поддержкой по вопросам подписок.</p>
          </div>
          <Link href="/docs/contact" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 lg:px-5 lg:py-2.5 bg-violet-600 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-violet-700 flex-shrink-0">Связаться</Link>
        </div>
      </div>
    </div>
  )
}