import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Calendar, Users, Wallet, Sparkles, Plus, AppWindow, ArrowRight, Zap, Shield, ArrowUpRight, ShoppingBag, Settings, CreditCard, User } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/dashboard")
  }

  const activeSubscriptions: any[] = []
  const expiringSoon: any[] = []
  const totalSpent = 0
  const totalUsers = 0

  const stats = [
    { label: "Активных подписок", value: activeSubscriptions.length, icon: Package, color: "violet" },
    { label: "Истекает скоро", value: expiringSoon.length, icon: Calendar, color: "amber" },
    { label: "Пользователей", value: totalUsers, icon: Users, color: "emerald" },
    { label: "Расходы в месяц", value: `${totalSpent.toLocaleString("ru")} ₽`, icon: Wallet, color: "blue" },
  ]

  const quickActions = [
    { title: "Мои приложения", description: "Управляйте подписками", icon: AppWindow, href: "/dashboard/apps", color: "violet" },
    { title: "Каталог", description: "Новые инструменты", icon: ShoppingBag, href: "/catalog", color: "emerald" },
    { title: "Платежи", description: "Счета и оплата", icon: CreditCard, href: "/dashboard/billing", color: "amber" },
    { title: "Профиль", description: "Настройки аккаунта", icon: Settings, href: "/dashboard/profile", color: "blue" },
  ]

  const recentActivity = [
    { text: "Добавлен новый пользователь в CRM", time: "2 часа назад", icon: Users },
    { text: "Обновлена подписка на Документы", time: "Вчера", icon: Package },
    { text: "Оплачен счет за Аналитику", time: "3 дня назад", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Banner */}
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-neutral-300">Личный кабинет</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight mb-3">
                Привет, {session.user.name || "пользователь"}!
              </h1>
              <p className="text-neutral-400 text-lg max-w-xl">
                Управляйте приложениями, подписками и настройками вашего бизнеса
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-neutral-900 
                rounded-full font-bold hover:bg-neutral-100 transition-all duration-300
                flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              Добавить приложение
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="relative -mt-10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8
                  hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500"
              >
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <div className="text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Быстрые действия
            </p>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-neutral-900">
              Что вы хотите сделать?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="group bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8
                  hover:shadow-xl hover:border-neutral-200 transition-all duration-500
                  hover:-translate-y-1 h-full">
                  <div className={`w-14 h-14 bg-${action.color}-50 rounded-2xl flex items-center 
                    justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                    <action.icon className={`w-7 h-7 text-${action.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{action.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-400 
                    group-hover:text-neutral-900 transition-colors">
                    Перейти
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 
                      group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Activity & Support */}
      <section className="py-12 lg:py-16 bg-white border-t border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-violet-500" />
                <h3 className="text-xl font-bold text-neutral-900">Последние действия</h3>
              </div>
              <div className="bg-neutral-50 rounded-3xl p-6 lg:p-8 space-y-6">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900">{activity.text}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 font-medium">Пока нет действий</p>
                    <p className="text-sm text-neutral-400">Здесь будет отображаться ваша активность</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support & Tips */}
            <div className="space-y-6">
              {/* Support */}
              <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-violet-500" />
                  <h3 className="text-xl font-bold text-violet-900">Нужна помощь?</h3>
                </div>
                <p className="text-violet-700 mb-6 leading-relaxed">
                  Наша команда поддержки доступна 24/7 для решения любых вопросов.
                </p>
                <Link
                  href="/docs/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white 
                    rounded-full font-bold hover:bg-violet-700 transition-all duration-300"
                >
                  Связаться с поддержкой
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Tip */}
              <div className="bg-neutral-50 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-neutral-900">Совет</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Добавьте несколько приложений и управляйте ими из одного места.
                  Все данные синхронизируются автоматически.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}