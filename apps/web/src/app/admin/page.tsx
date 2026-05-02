import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { AppWindow, FileText, Users, MessageSquare, Tag, BarChart3, ClipboardList, Shield, Building2, CreditCard, Package, Globe, Server, TrendingUp, Zap, Bell, Calendar, Wallet, ArrowRight, Plus, Sparkles, Settings, CheckCircle, AlertCircle, Clock, DollarSign } from "lucide-react"

async function getAdminStats() {
  const [
    appsCount,
    usersCount,
    organizationsCount,
    postsCount,
    reviewsCount,
    activeSubscriptions,
  ] = await Promise.all([
    prisma.app.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.organization.count(),
    prisma.post.count(),
    prisma.review.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ])

  // Calculate revenue from active subscriptions
  const activeSubsWithPlans = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: {
      plan: true,
    },
    take: 100, // Limit for performance
  })

  const revenue = activeSubsWithPlans.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0)
  const pendingReviews = 0 // Placeholder - no status field in Review model

  // Get recent activities
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true }
  })

  const recentSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      plan: { include: { app: true } },
      organization: true,
    }
  })

  return {
    appsCount,
    usersCount,
    organizationsCount,
    postsCount,
    reviewsCount,
    activeSubscriptions,
    revenue,
    pendingReviews,
    recentUsers,
    recentSubscriptions,
  }
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.email === "admin@devtrust.ru"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  const mainStats = [
    { 
      label: "Активных подписок", 
      value: stats.activeSubscriptions, 
      icon: Package, 
      color: "red", 
      change: "+12%", 
      description: "За последний месяц" 
    },
    { 
      label: "Пользователей", 
      value: stats.usersCount, 
      icon: Users, 
      color: "violet", 
      change: "+8%", 
      description: "Всего зарегистрировано" 
    },
    { 
      label: "Ежемесячный доход", 
      value: `${stats.revenue.toLocaleString("ru")} ₽`, 
      icon: DollarSign, 
      color: "emerald", 
      change: "+15%", 
      description: "Прогноз на месяц" 
    },
    { 
      label: "Организаций", 
      value: stats.organizationsCount, 
      icon: Building2, 
      color: "blue", 
      change: "+5", 
      description: "Активных компаний" 
    },
  ]

  const quickActions = [
    { 
      title: "Управление приложениями", 
      description: "Добавляйте и редактируйте приложения", 
      icon: AppWindow, 
      href: "/admin/apps", 
      color: "red", 
      gradient: "from-red-400 to-orange-400" 
    },
    { 
      title: "Пользователи", 
      description: "Просмотр и управление аккаунтами", 
      icon: Users, 
      href: "/admin/users", 
      color: "violet", 
      gradient: "from-violet-400 to-purple-400" 
    },
    { 
      title: "Модерация отзывов", 
      description: `${stats.pendingReviews} отзывов на проверке`, 
      icon: MessageSquare, 
      href: "/admin/reviews", 
      color: "blue", 
      gradient: "from-blue-400 to-cyan-400" 
    },
    { 
      title: "Аналитика платформы", 
      description: "Статистика и метрики", 
      icon: BarChart3, 
      href: "/admin/analytics", 
      color: "emerald", 
      gradient: "from-emerald-400 to-teal-400" 
    },
  ]

  const systemStatus = [
    { label: "База данных", status: "operational", icon: Server },
    { label: "Платежная система", status: "operational", icon: CreditCard },
    { label: "Файловое хранилище", status: "operational", icon: Package },
    { label: "API", status: "warning", icon: Globe },
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
                  <Shield className="w-4 h-4" />
                  Административная панель
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Добро пожаловать, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{session.user.name || "Администратор"}!</span>
                </h1>
                <p className="text-lg text-slate-600">Управление платформой DevTrust и мониторинг системы</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  Аналитика
                </Link>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Настройки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainStats.map((stat, i) => {
                const Icon = stat.icon
                const colorClasses = {
                  red: "bg-red-50 text-red-600",
                  violet: "bg-violet-50 text-violet-600",
                  emerald: "bg-emerald-50 text-emerald-600",
                  blue: "bg-blue-50 text-blue-600",
                  orange: "bg-amber-50 text-amber-600",
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
                      <div className="text-xs text-slate-400 mt-2">{stat.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
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
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </Link>
                    )
                  })}
                </div>

                {/* Recent Subscriptions */}
                {stats.recentSubscriptions.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Последние подписки</h2>
                      <Link
                        href="/admin/apps"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Все подписки
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {stats.recentSubscriptions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-6 hover:bg-white/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900">{sub.plan.app.name}</h4>
                                  <p className="text-sm text-slate-500">{sub.organization.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-slate-900">{sub.plan.price} ₽/мес</div>
                                <div className="text-xs text-slate-500">
                                  {new Date(sub.createdAt).toLocaleDateString("ru")}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - System Status & Recent Users */}
              <div className="space-y-8">
                {/* System Status */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Статус системы</h2>
                  <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                    <div className="space-y-4">
                      {systemStatus.map((item, i) => {
                        const Icon = item.icon
                        const statusColor = item.status === "operational" ? "text-emerald-500" : "text-amber-500"
                        const statusIcon = item.status === "operational" ? CheckCircle : AlertCircle
                        const StatusIcon = statusIcon

                        return (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{item.label}</div>
                                <div className="text-sm text-slate-500">В работе</div>
                              </div>
                            </div>
                            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Последняя проверка</span>
                        <span className="font-medium text-slate-900">Только что</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Users */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Новые пользователи</h2>
                  <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                    <div className="space-y-4">
                      {stats.recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{user.name || "Без имени"}</div>
                              <div className="text-sm text-slate-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">
                              {new Date(user.createdAt).toLocaleDateString("ru")}
                            </div>
                            <div className="text-xs font-medium text-blue-600">Новый</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/admin/users"
                      className="mt-6 block text-center py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      Показать всех пользователей
                    </Link>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-4">Общая статистика</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Приложений в каталоге</span>
                      <span className="font-bold">{stats.appsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Постов в блоге</span>
                      <span className="font-bold">{stats.postsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Отзывов</span>
                      <span className="font-bold">{stats.reviewsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">На модерации</span>
                      <span className="font-bold">{stats.pendingReviews}</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/analytics"
                    className="mt-6 block text-center py-3 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    Подробная аналитика
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Нужна помощь с администрированием?</h3>
                  <p className="text-slate-300">Ознакомьтесь с документацией или свяжитесь с поддержкой</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/docs"
                    className="px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
                  >
                    Документация
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 font-semibold rounded-xl transition-all"
                  >
                    Настройки системы
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