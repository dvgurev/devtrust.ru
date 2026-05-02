import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, AppWindow, Bell, User, MessageSquare, Settings, LayoutDashboard, Sparkles, Shield, ArrowRight } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/apps", label: "Мои приложения", icon: AppWindow },
  { href: "/dashboard/subscriptions", label: "Подписки", icon: Settings },
  { href: "/dashboard/billing", label: "История платежей", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Уведомления", icon: Bell },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
  { href: "/dashboard/reviews", label: "Мои отзывы", icon: MessageSquare },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const isAdmin = session.user.email === "admin@devtrust.ru"

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - sticky on large screens */}
      <aside className="sticky top-0 h-screen w-64 bg-white/40 backdrop-blur-2xl border-r border-white/30 flex-shrink-0 hidden lg:block shadow-xl shadow-black/5 z-40">
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="flex items-center gap-3 mb-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-shadow">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-slate-900">Кабинет</span>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Меню пользователя</span>
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="mb-8">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-200 border border-transparent hover:border-white/50 shadow-sm hover:shadow-md"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-white flex items-center justify-center shadow-inner group-hover:from-red-50 group-hover:to-orange-50 transition-all">
                      <Icon className="w-4 h-4 text-slate-600 group-hover:text-red-500" />
                    </div>
                    <span>{item.label}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Catalog */}
          <div className="mb-8">
            <Link
              href="/catalog"
              className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 bg-gradient-to-r from-red-50/50 to-orange-50/50 hover:from-red-100/60 hover:to-orange-100/60 backdrop-blur-sm rounded-2xl transition-all duration-200 border border-red-100/50 hover:border-red-200/50 shadow-sm hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4 text-red-500" />
              </div>
              <span>Каталог приложений</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-red-400" />
              </div>
            </Link>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-auto pt-8 border-t border-white/30">
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Администрирование</span>
              </div>
              <Link
                href="/admin"
                className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 bg-gradient-to-r from-violet-50/50 to-purple-50/50 hover:from-violet-100/60 hover:to-purple-100/60 backdrop-blur-sm rounded-2xl transition-all duration-200 border border-violet-100/50 hover:border-violet-200/50 shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shadow-inner">
                  <Shield className="w-4 h-4 text-violet-500" />
                </div>
                <span>Админ-панель</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-8 pt-0">
        {children}
      </main>
    </div>
  )
}