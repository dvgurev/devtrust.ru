// apps/web/src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Calendar, Users, Wallet, Sparkles, Plus, AppWindow, ArrowRight, Zap, Shield, ArrowUpRight, ShoppingBag, Settings, CreditCard } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login?redirect=/dashboard")

  const stats = [
    { label: "Подписок", value: 0, icon: Package, color: "violet" },
    { label: "Истекает", value: 0, icon: Calendar, color: "amber" },
    { label: "Пользователей", value: 0, icon: Users, color: "emerald" },
    { label: "Расходы", value: "0 ₽", icon: Wallet, color: "blue" },
  ]

  const quickActions = [
    { title: "Приложения", desc: "Мои подписки", icon: AppWindow, href: "/dashboard/apps", color: "violet" },
    { title: "Каталог", desc: "Все приложения", icon: ShoppingBag, href: "/catalog", color: "emerald" },
    { title: "Платежи", desc: "Счета", icon: CreditCard, href: "/dashboard/billing", color: "amber" },
    { title: "Профиль", desc: "Настройки", icon: Settings, href: "/dashboard/profile", color: "blue" },
  ]

  const recentActivity = [
    { text: "Добавлен новый пользователь в CRM", time: "2 часа назад", icon: Users },
    { text: "Обновлена подписка на Документы", time: "Вчера", icon: Package },
    { text: "Оплачен счет за Аналитику", time: "3 дня назад", icon: CreditCard },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight mb-1">
            Привет, {session.user.name || "пользователь"}!
          </h1>
          <p className="text-neutral-500 text-sm">Управляйте приложениями и подписками</p>
        </div>
        <Link href="/catalog"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
          <Plus className="w-4 h-4" /> Добавить приложение
        </Link>
        <Link href="/catalog"
          className="sm:hidden inline-flex items-center gap-1.5 text-sm font-bold text-violet-600">
          <Plus className="w-4 h-4" /> Добавить приложение
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
            <stat.icon className="w-5 h-5 text-neutral-400 mb-2 lg:mb-3" />
            <div className="text-xl lg:text-3xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-xs lg:text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {quickActions.map((action, i) => (
          <Link key={i} href={action.href}>
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6
              hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-neutral-100 rounded-xl lg:rounded-2xl 
                flex items-center justify-center mb-3 lg:mb-5">
                <action.icon className="w-5 h-5 lg:w-7 lg:h-7 text-neutral-700" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm lg:text-xl mb-1">{action.title}</h3>
              <p className="text-xs lg:text-sm text-neutral-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Support */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
            <h3 className="font-bold text-neutral-900 text-sm lg:text-xl">Последние действия</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{activity.text}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
            <h3 className="font-bold text-violet-900 text-sm lg:text-xl">Нужна помощь?</h3>
          </div>
          <p className="text-violet-700 text-xs lg:text-sm mb-4">Наша поддержка доступна 24/7</p>
          <Link href="/docs/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 
              bg-violet-600 text-white rounded-full font-bold text-sm hover:bg-violet-700 transition-all">
            Связаться <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}