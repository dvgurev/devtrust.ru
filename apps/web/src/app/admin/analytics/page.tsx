import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Users, Building2, AppWindow, FileText, TrendingUp,
  Activity, Sparkles, ArrowRight, BarChart3, Star,
  Package, ArrowUpRight, DollarSign
} from "lucide-react"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const [
    totalUsers, totalOrganizations, totalSubscriptions,
    activeSubscriptions, totalApps, publishedPosts,
    totalReviews, pendingReviews,
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
    include: { plan: { include: { app: true } }, organization: true },
  })

  const topApps = await prisma.app.findMany({
    where: { status: "ACTIVE" },
    orderBy: { averageRating: "desc" },
    take: 5,
  })

  const mainStats = [
    { label: "Пользователей", value: totalUsers, icon: Users, color: "violet" },
    { label: "Подписок", value: activeSubscriptions, icon: Package, color: "emerald" },
    { label: "Доход", value: `${totalRevenue.toLocaleString("ru")} ₽`, icon: DollarSign, color: "blue" },
    { label: "Организаций", value: totalOrganizations, icon: Building2, color: "amber" },
  ]

  const secondaryStats = [
    { label: "Приложений", value: totalApps, icon: AppWindow, suffix: "активных" },
    { label: "Статей", value: publishedPosts, icon: FileText, suffix: "опубликовано" },
    { label: "Отзывов", value: totalReviews, icon: Star, suffix: `${pendingReviews} на модерации` },
    {
      label: "Удержание",
      value: totalSubscriptions > 0
        ? `${Math.round((activeSubscriptions / totalSubscriptions) * 100)}%`
        : "0%",
      icon: TrendingUp,
      suffix: "активных"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Аналитика
          </h1>
          <p className="text-neutral-500 mt-1">
            Ключевые показатели и метрики платформы
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <ArrowRight className="w-4 h-4" />
          Панель управления
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-6">
            <div className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <div className="text-2xl lg:text-3xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-6">
            <stat.icon className="w-5 h-5 text-neutral-400 mb-3" />
            <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{stat.suffix}</div>
          </div>
        ))}
      </div>

      {/* Recent Users & Top Apps */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Новые пользователи</h2>
            <Link href="/admin/users" className="text-sm font-medium text-violet-600 hover:text-violet-700">
              Все
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{user.name || "Без имени"}</p>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(user.createdAt).toLocaleDateString("ru")}
                </span>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="py-8 text-center">
                <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Пользователей пока нет</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Apps */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Популярные приложения</h2>
            <Link href="/admin/apps" className="text-sm font-medium text-violet-600 hover:text-violet-700">
              Все
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {topApps.map((app, index) => (
              <div key={app.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-neutral-500">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{app.name}</p>
                    <p className="text-xs text-neutral-400">/{app.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-neutral-900">{app.averageRating.toFixed(1)}</span>
                </div>
              </div>
            ))}
            {topApps.length === 0 && (
              <div className="py-8 text-center">
                <AppWindow className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Приложений пока нет</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Subscriptions */}
      {recentSubscriptions.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Последние подписки</h2>
            <Link href="/admin/apps" className="text-sm font-medium text-violet-600 hover:text-violet-700">
              Все
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentSubscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{sub.plan.app.name}</p>
                    <p className="text-xs text-neutral-400">{sub.organization.name} · {sub.plan.name}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neutral-900">
                  {sub.plan.price.toLocaleString("ru")} ₽/мес
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-violet-500" />
            <h3 className="font-bold text-violet-900">Детальная аналитика</h3>
          </div>
          <p className="text-violet-700 text-sm mb-4">
            Просматривайте подробные отчёты по всем метрикам платформы.
          </p>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
              rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300"
          >
            <BarChart3 className="w-4 h-4" />
            Открыть отчёты
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-neutral-900">Быстрые метрики</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Активных подписок</span>
              <span className="font-bold text-neutral-900">{activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">На модерации</span>
              <span className="font-bold text-amber-600">{pendingReviews}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Доход всего</span>
              <span className="font-bold text-neutral-900">{totalRevenue.toLocaleString("ru")} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}