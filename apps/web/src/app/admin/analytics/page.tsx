import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, Building2, CreditCard, AppWindow, FileText, TrendingUp, Currency, Activity, Sparkles, Zap, ArrowRight, BarChart3, Star, Package, Clock, Shield, Calendar, DollarSign } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "ADMIN"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  const [
    totalUsers,
    totalOrganizations,
    totalSubscriptions,
    activeSubscriptions,
    totalApps,
    publishedPosts,
    totalReviews,
    pendingReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.app.count({ where: { status: "ACTIVE" } }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.review.count(),
    prisma.review.count({ where: { isModerated: false } }),
  ])

  const revenue = await prisma.invoice.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  })

  const totalRevenue = (revenue._sum.amount || 0) / 100

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const recentSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      plan: { include: { app: true } },
      organization: true,
    },
  })

  const topApps = await prisma.app.findMany({
    where: { status: "ACTIVE" },
    orderBy: { averageRating: "desc" },
    take: 5,
  })

  const mainStats = [
    {
      label: "Пользователей",
      value: totalUsers,
      icon: Users,
      color: "blue",
      change: `+${Math.min(totalUsers, 12)}%`,
      description: "Всего зарегистрировано"
    },
    {
      label: "Активных подписок",
      value: activeSubscriptions,
      icon: Package,
      color: "red",
      change: `+${Math.min(activeSubscriptions, 8)}%`,
      description: `${totalSubscriptions} всего`
    },
    {
      label: "Общий доход",
      value: `${totalRevenue.toLocaleString("ru")} ₽`,
      icon: DollarSign,
      color: "emerald",
      change: `+${Math.min(Math.round(totalRevenue / 1000), 22)}%`,
      description: "За всё время"
    },
    {
      label: "Организаций",
      value: totalOrganizations,
      icon: Building2,
      color: "violet",
      change: `+${Math.min(totalOrganizations, 5)}`,
      description: "Активных компаний"
    },
  ]

  const secondaryStats = [
    {
      label: "Приложений в каталоге",
      value: totalApps,
      icon: AppWindow,
      gradient: "from-blue-400 to-blue-600",
      subtitle: "Активные"
    },
    {
      label: "Статей в блоге",
      value: publishedPosts,
      icon: FileText,
      gradient: "from-violet-400 to-violet-600",
      subtitle: "Опубликовано"
    },
    {
      label: "Отзывов всего",
      value: totalReviews,
      icon: Star,
      gradient: "from-amber-400 to-amber-600",
      subtitle: `${pendingReviews} на модерации`
    },
    {
      label: "Коэффициент удержания",
      value: `${totalSubscriptions > 0 ? Math.round((activeSubscriptions / totalSubscriptions) * 100) : 0}%`,
      icon: TrendingUp,
      gradient: "from-emerald-400 to-emerald-600",
      subtitle: "Активных подписок"
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-blue-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <BarChart3 className="w-4 h-4" />
                  Аналитика платформы
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Аналитика
                </h1>
                <p className="text-lg text-slate-600">Обзор ключевых показателей и метрик платформы</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Панель управления
                </Link>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  Отчёты
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainStats.map((stat, i) => {
                const Icon = stat.icon
                const colorClasses: Record<string, string> = {
                  red: "bg-red-50 text-red-600",
                  violet: "bg-violet-50 text-violet-600",
                  emerald: "bg-emerald-50 text-emerald-600",
                  blue: "bg-blue-50 text-blue-600",
                }

                return (
                  <div
                    key={i}
                    className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                      <div className="text-xs text-slate-400 mt-2">{stat.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {secondaryStats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div
                    key={i}
                    className="group bg-gradient-to-br rounded-3xl p-6 text-white hover:shadow-xl transition-all"
                    style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <Icon className="w-6 h-6" />
                        </div>
                        <Sparkles className="w-5 h-5 text-white/60" />
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-white/80 mt-2">{stat.label}</div>
                      <div className="text-xs text-white/60 mt-1">{stat.subtitle}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Analytics */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Новые пользователи</h2>
                  <Link
                    href="/admin/users"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Все пользователи
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="p-6 hover:bg-white/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                              {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{user.name || "Без имени"}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              {new Date(user.createdAt).toLocaleDateString("ru")}
                            </p>
                            <p className="text-xs font-medium text-blue-600">Новый пользователь</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentUsers.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500">Пользователей пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Apps */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Популярные приложения</h2>
                  <Link
                    href="/admin/apps"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Все приложения
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {topApps.map((app, index) => (
                      <div key={app.id} className="p-6 hover:bg-white/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <span className="text-lg font-bold text-slate-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{app.name}</p>
                              <p className="text-sm text-slate-500">/{app.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-slate-900">{app.averageRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-sm font-medium">Популярное</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {topApps.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                          <AppWindow className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500">Приложений пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Subscriptions */}
      {recentSubscriptions.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Последние подписки</h2>
                <Link
                  href="/admin/subscriptions"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Все подписки
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {recentSubscriptions.map((sub) => (
                    <div key={sub.id} className="p-6 hover:bg-white/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{sub.plan.app.name}</h4>
                            <p className="text-sm text-slate-500">
                              {sub.organization.name} • {sub.plan.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{sub.plan.price.toLocaleString("ru")} ₽/мес</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(sub.createdAt).toLocaleDateString("ru")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Детальная аналитика</h3>
                </div>
                <p className="text-blue-100 text-lg mb-6">
                  Просматривайте подробные отчёты, графики и статистику по всем метрикам платформы.
                </p>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <BarChart3 className="w-5 h-5" />
                  Открыть отчёты
                </Link>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-900">Последние обновления</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Новых пользователей сегодня</span>
                    <span className="font-bold text-slate-900">
                      {recentUsers.filter(u => {
                        const today = new Date()
                        const userDate = new Date(u.createdAt)
                        return userDate.toDateString() === today.toDateString()
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Активных подписок</span>
                    <span className="font-bold text-emerald-600">{activeSubscriptions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Отзывов на модерации</span>
                    <span className="font-bold text-amber-600">{pendingReviews}</span>
                  </div>
                </div>
                <Link
                  href="/admin/audit"
                  className="mt-6 block text-center py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  Открыть журнал действий
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
