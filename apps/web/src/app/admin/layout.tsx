import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AppWindow, FileText, Users, Tag, BarChart3, MessageSquare, Settings, ClipboardList, LayoutDashboard, Shield, ArrowLeft, Building2, Home, Bell, Menu, X, ChevronDown, CreditCard, Package, Globe, Server, ArrowRight, Sparkles, Zap } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "ADMIN"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const mainMenu = [
    { href: "/admin", label: "Обзор", icon: LayoutDashboard },
    { href: "/admin/apps", label: "Приложения", icon: AppWindow },
    { href: "/admin/users", label: "Пользователи", icon: Users },
    { href: "/admin/organizations", label: "Организации", icon: Building2 },
    { href: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
    { href: "/admin/posts", label: "Блог", icon: FileText },
  ]

  const secondaryMenu = [
    { href: "/admin/promo", label: "Промокоды", icon: Tag },
    { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
    { href: "/admin/audit", label: "Audit", icon: ClipboardList },
    { href: "/admin/settings", label: "Настройки", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - floating style */}
      <aside className="sticky top-3 h-[calc(100vh-1.5rem)] w-56 px-4 py-3 flex-shrink-0 hidden lg:flex flex-col z-40">
        <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100/50">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Админ</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            <div className="px-3 py-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Управление</span>
            </div>
            {mainMenu.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div className="my-2 px-3 py-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Система</span>
            </div>
            {secondaryMenu.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100/50">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-500">Система активна</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Кабинет</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/30 lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900">Админ-панель</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/notifications"
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="px-4 pb-3 overflow-x-auto">
            <nav className="flex items-center gap-1">
              {mainMenu.slice(0, 5).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl whitespace-nowrap transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl whitespace-nowrap transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Ещё</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
