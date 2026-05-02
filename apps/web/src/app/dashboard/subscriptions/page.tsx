import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, Calendar, AppWindow, ExternalLink, ArrowRight, Sparkles, AlertCircle, Check, Settings, Package, Shield, Zap } from "lucide-react"

function ManageSubscriptionButton() {
  return (
    <form action={async () => {
      "use server"
      const baseUrl = process.env.SITE_URL || "https://devtrust.ru"
      const res = await fetch(`${baseUrl}/api/billing/portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: `${baseUrl}/dashboard/subscriptions` }),
        cache: "no-store",
      })
      const data = await res.json()
      if (data.url) {
        redirect(data.url)
      }
    }}>
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all">
        <Settings className="w-5 h-5" />
        Управление подписками
      </button>
    </form>
  )
}

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-cyan-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-blue-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Package className="w-4 h-4" />
                  Управление подписками
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Подписки
                </h1>
                <p className="text-lg text-slate-600">Управляйте своими подписками и платежами</p>
              </div>
              <ManageSubscriptionButton />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {subscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  У вас пока нет подписок
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                  Подпишитесь на приложения для управления вашим бизнесом
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Открыть каталог
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map((sub: any) => {
                  const app = sub.plan?.app
                  const periodEnd = sub.currentPeriodEnd
                  const daysLeft = periodEnd ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
                  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
                  const isExpired = daysLeft !== null && daysLeft < 0

                  return (
                    <div
                      key={sub.id}
                      className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-all">
                            {app?.iconUrl ? (
                              <img src={app.iconUrl} alt={app.name} className="w-9 h-9" />
                            ) : (
                              <AppWindow className="w-8 h-8 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{app?.name || "Приложение"}</h3>
                            <p className="text-sm text-slate-500">{sub.plan?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-xl">
                            {sub.plan?.price > 0 ? `${sub.plan.price.toLocaleString("ru")} ₽/мес` : "Бесплатно"}
                          </p>
                          {sub.status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                              <Check className="w-4 h-4" />
                              Активна
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                              <AlertCircle className="w-4 h-4" />
                              Неактивна
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/30">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {periodEnd ? (
                              isExpired ? (
                                <span className="text-red-600 font-medium">Истекла {new Date(periodEnd).toLocaleDateString("ru")}</span>
                              ) : isExpiringSoon ? (
                                <span className="text-orange-600 font-medium">Истекает через {daysLeft} дн.</span>
                              ) : (
                                <span>До {new Date(periodEnd).toLocaleDateString("ru")}</span>
                              )
                            ) : (
                              <span>Бессрочно</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <form action={async () => {
                            "use server"
                            const baseUrl = process.env.SITE_URL || "https://devtrust.ru"
                            const res = await fetch(`${baseUrl}/api/billing/portal`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ returnUrl: `${baseUrl}/dashboard/subscriptions` }),
                              cache: "no-store",
                            })
                            const data = await res.json()
                            if (data.url) {
                              redirect(data.url)
                            }
                          }}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Управление
                            </button>
                          </form>
                          <Link
                            href={`/apps/${app?.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Открыть
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Support Card */}
            <div className="mt-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Нужна помощь?</h3>
                  </div>
                  <p className="text-blue-100 text-lg max-w-2xl">
                    Свяжитесь с нашей поддержкой для решения любых вопросов по подпискам, платежам или настройке приложений.
                  </p>
                </div>
                <Link
                  href="/docs/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Связаться с поддержкой
                </Link>
              </div>
            </div>

            {/* Stats */}
            {subscriptions.length > 0 && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {subscriptions.filter((s: any) => s.status === "ACTIVE").length}
                      </div>
                      <div className="text-sm text-slate-500">Активных подписок</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {subscriptions.filter((s: any) => {
                          const end = s.currentPeriodEnd
                          if (!end) return false
                          const days = Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                          return days <= 7 && days > 0
                        }).length}
                      </div>
                      <div className="text-sm text-slate-500">Истекают скоро</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {subscriptions.reduce((sum: number, s: any) => sum + (s.plan?.price || 0), 0).toLocaleString("ru")} ₽
                      </div>
                      <div className="text-sm text-slate-500">Ежемесячные расходы</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}