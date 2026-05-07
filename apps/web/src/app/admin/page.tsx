// ==================== PAGE ====================
// apps/web/src/app/admin/page.tsx

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  AppWindow, Users, MessageSquare, BarChart3, Building2,
  Package, TrendingUp, ArrowRight, ArrowUpRight, Sparkles,
  FileText, Tag, CreditCard, DollarSign
} from "lucide-react"

async function getAdminStats() {
  const [
    appsCount, usersCount, organizationsCount, postsCount,
    reviewsCount, activeSubscriptions, pendingReviews,
  ] = await Promise.all([
    prisma.app.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.organization.count(),
    prisma.post.count(),
    prisma.review.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.review.count({ where: { isModerated: false } }),
  ])

  const activeSubs = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: { plan: true },
    take: 100,
  })
  const revenue = activeSubs.reduce((s, sub) => s + (sub.plan?.price || 0), 0)

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const recentSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { plan: { include: { app: true } }, organization: true },
  })

  return {
    appsCount, usersCount, organizationsCount, postsCount,
    reviewsCount, activeSubscriptions, pendingReviews, revenue,
    recentUsers, recentSubscriptions,
  }
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const stats = await getAdminStats()

  const mainStats = [
    { label: "Пользователей", value: stats.usersCount, icon: Users, color: "violet" },
    { label: "Подписок", value: stats.activeSubscriptions, icon: Package, color: "emerald" },
    { label: "Доход", value: `${stats.revenue.toLocaleString("ru")} ₽`, icon: DollarSign, color: "blue" },
    { label: "Организаций", value: stats.organizationsCount, icon: Building2, color: "amber" },
  ]

  const quickActions = [
    { title: "Приложения", desc: `${stats.appsCount} в каталоге`, icon: AppWindow, href: "/admin/apps", color: "violet" },
    { title: "Пользователи", desc: `${stats.usersCount} аккаунтов`, icon: Users, href: "/admin/users", color: "blue" },
    { title: "Отзывы", desc: `${stats.pendingReviews} на модерации`, icon: MessageSquare, href: "/admin/reviews", color: "rose" },
    { title: "Аналитика", desc: "Метрики платформы", icon: BarChart3, href: "/admin/analytics", color: "emerald" },
  ]

  const secondaryStats = [
    { label: "Приложений", value: stats.appsCount, icon: AppWindow },
    { label: "Постов", value: stats.postsCount, icon: FileText },
    { label: "Отзывов", value: stats.reviewsCount, icon: MessageSquare },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Админ-панель
          </h1>
          <p className="text-neutral-500 mt-1">
            Добро пожаловать, {session.user.name || "Администратор"}
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4" />
          Каталог
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

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <Link key={i} href={action.href}>
            <div className="group bg-white rounded-3xl border border-neutral-100 p-6
              hover:shadow-lg hover:border-neutral-200 transition-all duration-500
              hover:-translate-y-1">
              <div className={`w-12 h-12 bg-${action.color}-50 rounded-2xl flex items-center 
                justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <action.icon className={`w-6 h-6 text-${action.color}-500`} />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">{action.title}</h3>
              <p className="text-sm text-neutral-500">{action.desc}</p>
              <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 
                mt-3 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Последние подписки</h2>
            <Link href="/admin/apps" className="text-sm font-medium text-violet-600 hover:text-violet-700">
              Все
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {stats.recentSubscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{sub.plan.app.name}</p>
                    <p className="text-xs text-neutral-400">{sub.organization.name}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neutral-900">
                  {sub.plan.price.toLocaleString("ru")} ₽
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Общая статистика</h2>
          <div className="space-y-3">
            {secondaryStats.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-neutral-900">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">Доход</span>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                {stats.revenue.toLocaleString("ru")} ₽/мес
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}