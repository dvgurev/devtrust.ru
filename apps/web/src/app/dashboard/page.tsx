import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Calendar, Users, Wallet, Sparkles, Plus, AppWindow, ArrowRight, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/dashboard")
  }

  // Mock data for now - the memberships type error will be fixed separately
  const activeSubscriptions: any[] = []
  const expiringSoon: any[] = []
  const totalSpent = 0
  const totalUsers = 0

  const stats = [
    { label: "Активных подписок", value: activeSubscriptions.length, icon: Package },
    { label: "Истекает скоро", value: expiringSoon.length, icon: Calendar },
    { label: "Всего пользователей", value: totalUsers, icon: Users },
    { label: "Ежемесячные расходы", value: `${totalSpent.toLocaleString("ru")} ₽`, icon: Wallet },
  ]

  return (
    <div className="bg-bg min-h-screen">
      {/* Header */}
      <section className="border-b-2 border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Ваш личный кабинет</div>
              <h1 className="font-display text-4xl md:text-6xl mb-2 text-fg">
                Добро пожаловать, {session.user.name || "пользователь"}!
              </h1>
              <p className="text-muted font-mono text-sm">Управляйте приложениями, подписками и настройками вашего бизнеса</p>
            </div>
            <Link href="/catalog">
              <div className="font-mono text-xs uppercase tracking-widest border-2 border-accent bg-accent text-bg px-6 py-3 hover:bg-accent/90 transition-all inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить приложение
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="border-2 border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 border-2 border-border">
                      <Icon className="w-6 h-6 text-fg" />
                    </div>
                  </div>
                  <div className="font-display text-5xl text-fg">{stat.value}</div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 border-t-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl md:text-4xl mb-6 text-fg">Быстрые действия</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Мои приложения", description: "Управляйте активными подписками", icon: AppWindow, href: "/dashboard/apps" },
                  { title: "Открыть каталог", description: "Найдите новые инструменты", icon: Plus, href: "/catalog" },
                  { title: "Управление платежами", description: "Обновите методы оплаты", icon: Wallet, href: "/dashboard/billing" },
                  { title: "Настройки профиля", description: "Персонализируйте аккаунт", icon: Users, href: "/dashboard/profile" },
                ].map((action, i) => (
                  <Link key={i} href={action.href}>
                    <div className="border-2 border-border p-6 hover:border-fg/50 transition-all h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 border-2 border-border">
                          <action.icon className="w-6 h-6 text-fg" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted" />
                      </div>
                      <h3 className="font-display text-2xl mb-2 text-fg">{action.title}</h3>
                      <p className="font-mono text-sm text-muted">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Activity */}
              <div className="border-2 border-border p-6">
                <h3 className="font-display text-2xl mb-4 text-fg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Последние действия
                </h3>
                <div className="space-y-4">
                  {[
                    { text: "Добавлен новый пользователь в CRM", time: "2 часа назад" },
                    { text: "Обновлена подписка на Документы", time: "Вчера" },
                    { text: "Оплачен счет за Аналитику", time: "3 дня назад" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                      <div>
                        <p className="text-sm text-fg">{activity.text}</p>
                        <p className="text-xs text-muted mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="border-2 border-border p-6">
                <h3 className="font-display text-2xl mb-4 text-fg">Нужна помощь?</h3>
                <p className="text-sm text-muted mb-4 font-mono">
                  Наша команда поддержки доступна 24/7 для решения любых вопросов.
                </p>
                <Link href="/docs/contact">
                  <div className="font-mono text-xs uppercase tracking-widest border-2 border-border px-4 py-3 text-fg hover:border-fg transition-all text-center">
                    Связаться с поддержкой
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}