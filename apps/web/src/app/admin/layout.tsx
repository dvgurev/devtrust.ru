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

  const isAdmin = session.user.email === "admin@devtrust.ru"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const navItems = [
    { href: "/admin", label: "Обзор", icon: LayoutDashboard },
    { href: "/admin/apps", label: "Приложения", icon: AppWindow },
    { href: "/admin/users", label: "Пользователи", icon: Users },
    { href: "/admin/organizations", label: "Организации", icon: Building2 },
    { href: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
    { href: "/admin/posts", label: "Блог", icon: FileText },
    { href: "/admin/promo", label: "Промокоды", icon: Tag },
    { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
    { href: "/admin/audit", label: "Audit Log", icon: ClipboardList },
    { href: "/admin/settings", label: "Настройки", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - sticky on large screens */}
      <aside className="sticky top-0 h-screen w-72 bg-white/40 backdrop-blur-2xl border-r border-white/30 flex-shrink-0 hidden lg:flex flex-col shadow-xl shadow-black/5 z-40">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/30">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900">Админ-панель</span>
              <span className="block text-xs font-medium text-slate-500">DevTrust Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 block">
              Основное меню
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200 border border-transparent hover:border-white/50 hover:shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-50 to-white flex items-center justify-center shadow-inner group-hover:from-blue-50 group-hover:to-indigo-50 transition-all">
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 block">
              Быстрые действия
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/apps?action=create"
                className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/60 hover:to-indigo-100/60 rounded-xl transition-all duration-200 border border-blue-100/50 hover:border-blue-200/50"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <AppWindow className="w-4 h-4 text-blue-500" />
                </div>
                <span>Создать приложение</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 ml-auto" />
              </Link>
              <Link
                href="/admin/posts#add-post"
                className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 hover:from-cyan-100/60 hover:to-blue-100/60 rounded-xl transition-all duration-200 border border-cyan-100/50 hover:border-cyan-200/50"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-500" />
                </div>
                <span>Написать статью</span>
              </Link>
              <Link
                href="/admin/promo#create-promo"
                className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-600 hover:text-amber-700 bg-gradient-to-r from-amber-50/50 to-orange-50/50 hover:from-amber-100/60 hover:to-orange-100/60 rounded-xl transition-all duration-200 border border-amber-100/50 hover:border-amber-200/50"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-amber-500" />
                </div>
                <span>Создать промокод</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">Система работает</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">База данных</span>
                <span className="text-emerald-600 font-medium">OK</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">API</span>
                <span className="text-emerald-600 font-medium">OK</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Платежи</span>
                <span className="text-emerald-600 font-medium">OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/30">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl transition-all duration-200 border border-slate-100/50 hover:border-slate-200/50"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
            </div>
            <span>В кабинет</span>
          </Link>
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
                  <span className="block text-xs text-slate-500">DevTrust Admin</span>
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
              {navItems.slice(0, 6).map((item) => {
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}