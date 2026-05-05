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

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - floating style */}
      <aside className="sticky top-3 h-[calc(100vh-1.5rem)] w-64 px-4 py-3 flex-shrink-0 hidden lg:flex flex-col z-40">
        <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100/50">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Кабинет</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Мои отзывы</span>
            </Link>

            <div className="my-2 border-t border-slate-100/50"></div>

            <Link
              href="/catalog"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50/80 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Каталог</span>
            </Link>
          </nav>

          {/* Footer */}
          {isAdmin && (
            <div className="p-3 border-t border-slate-100/50">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-violet-600 hover:bg-violet-50/80 rounded-xl transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Админ-панель</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
