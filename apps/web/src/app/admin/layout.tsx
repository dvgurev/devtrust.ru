// ==================== LAYOUT ====================
// apps/web/src/app/admin/layout.tsx

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  AppWindow, FileText, Users, Tag, BarChart3, MessageSquare,
  Settings, ClipboardList, LayoutDashboard, Shield, Building2,
  CreditCard, ArrowLeft, Sparkles
} from "lucide-react"

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
  { href: "/admin/settings", label: "Настройки", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-neutral-100">
          <Link href="/admin" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">Админ</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          <div>
            <p className="px-3 mb-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Управление
            </p>
            <div className="space-y-0.5">
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 
                    transition-all duration-200"
                >
                  <item.icon className="w-4 h-4 text-neutral-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Система
            </p>
            <div className="space-y-0.5">
              {secondaryMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 
                    transition-all duration-200"
                >
                  <item.icon className="w-4 h-4 text-neutral-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Система активна
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 
              transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-400" />
            В кабинет
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}