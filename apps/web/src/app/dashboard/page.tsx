import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Calendar, Users, Wallet, Sparkles, Plus, CreditCard, AppWindow, ArrowRight, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/dashboard")
  }

  const subscriptions = session.user?.memberships?.flatMap((m: any) => m.organization?.subscriptions || []) || []

  const activeSubscriptions = subscriptions.filter((s: any) => s.status === "ACTIVE")
  const expiringSoon = subscriptions.filter((s: any) => {
    const daysLeft = s.currentPeriodEnd ? Math.ceil((new Date(s.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
    return daysLeft !== null && daysLeft <= 7 && daysLeft > 0
  })

  const totalSpent = activeSubscriptions.reduce((sum: number, s: any) => sum + (s.plan?.price || 0), 0)
  const totalUsers = activeSubscriptions.reduce((sum: number, s: any) => sum + (s.seats || 1), 0)

  const stats = [
    { label: "Активных подписок", value: activeSubscriptions.length, icon: Package, color: "red", change: "+2" },
    { label: "Истекает скоро", value: expiringSoon.length, icon: Calendar, color: "orange", change: expiringSoon.length > 0 ? "Требует внимания" : "Все в порядке" },
    { label: "Всего пользователей", value: totalUsers, icon: Users, color: "violet", change: "+5" },
    { label: "Ежемесячные расходы", value: `${totalSpent.toLocaleString("ru")} ₽`, icon: Wallet, color: "emerald", change: "+12%" },
  ]

  const quickActions = [
    { title: "Мои приложения", description: "Управляйте активными подписками", icon: AppWindow, href: "/dashboard/apps", color: "red", gradient: "from-red-400 to-orange-400" },
    { title: "Открыть каталог", description: "Найдите новые инструменты", icon: Plus, href: "/catalog", color: "violet", gradient: "from-violet-400 to-purple-400" },
    { title: "Управление платежами", description: "Обновите методы оплаты", icon: CreditCard, href: "/dashboard/billing", color: "blue", gradient: "from-blue-400 to-cyan-400" },
    { title: "Настройки профиля", description: "Персонализируйте аккаунт", icon: Users, href: "/dashboard/profile", color: "emerald", gradient: "from-emerald-400 to-teal-400" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  Ваш личный кабинет
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Добро пожаловать, <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{session.user.name || "пользователь"}!</span>
                </h1>
                <p className="text-lg text-slate-600">Управляйте приложениями, подписками и настройками вашего бизнеса</p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Добавить приложение
              </Link>
            </div>
          </div>
      </section>

      {/* Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                const colorClasses = {
                  red: "bg-red-50 text-red-600",
                  orange: "bg-amber-50 text-amber-600",
                  violet: "bg-violet-50 text-violet-600",
                  emerald: "bg-emerald-50 text-emerald-600",
                  blue: "bg-blue-50 text-blue-600",
                }[stat.color]

                return (
                  <div
                    key={i}
                    className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${colorClasses}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Quick Actions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Быстрые действия</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {quickActions.map((action, i) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={i}
                        href={action.href}
                        className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </Link>
                    )
                  })}
                </div>

                {/* Active Subscriptions */}
                {activeSubscriptions.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Активные подписки</h2>
                      <Link
                        href="/dashboard/apps"
                        className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        Все приложения
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {activeSubscriptions.slice(0, 5).map((sub: any) => (
                          <div
                            key={sub.id}
                            className="p-6 hover:bg-white/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center">
                                  {sub.plan?.app?.iconUrl ? (
                                    <img src={sub.plan.app.iconUrl} alt="" className="w-6 h-6" />
                                  ) : (
                                    <AppWindow className="w-6 h-6 text-red-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{sub.plan?.app?.name || "Приложение"}</p>
                                  <p className="text-sm text-slate-500">{sub.plan?.name} • {sub.seats || 1} пользователь</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">{sub.plan?.price?.toLocaleString("ru")} ₽/мес</p>
                                <p className="text-sm text-slate-500">
                                  До {sub.currentPeriodEnd?.toLocaleDateString("ru", { day: "numeric", month: "long" })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Recent Activity */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Последние действия
                  </h3>
                  <div className="space-y-4">
                    {[
                      { text: "Добавлен новый пользователь в CRM", time: "2 часа назад" },
                      { text: "Обновлена подписка на Документы", time: "Вчера" },
                      { text: "Оплачен счет за Аналитику", time: "3 дня назад" },
                      { text: "Приглашен новый сотрудник", time: "Неделю назад" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                        <div>
                          <p className="text-sm text-slate-700">{activity.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Updates */}
                <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg">Советы по безопасности</h3>
                  </div>
                  <p className="text-red-100 text-sm mb-4">
                    Регулярно обновляйте пароли и используйте двухфакторную аутентификацию для защиты вашего аккаунта.
                  </p>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-red-100"
                  >
                    Настроить безопасность
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Support */}
                <div className="mt-6 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Нужна помощь?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Наша команда поддержки доступна 24/7 для решения любых вопросов.
                  </p>
                  <Link
                    href="/docs/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Связаться с поддержкой
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}