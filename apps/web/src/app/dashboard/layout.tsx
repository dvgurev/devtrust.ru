import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, AppWindow, CreditCard, Bell, User, Settings,
  ShoppingBag, Shield, Sparkles, MessageSquare, Receipt, ChevronRight,
  ArrowUpRight
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/apps", label: "Мои приложения", icon: AppWindow },
  { href: "/dashboard/subscriptions", label: "Подписки", icon: Receipt },
  { href: "/dashboard/billing", label: "Платежи", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Уведомления", icon: Bell },
  { href: "/dashboard/reviews", label: "Отзывы", icon: MessageSquare },
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
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Кабинет</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                  text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 
                  transition-all duration-200 group"
              >
                <Icon className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 
                  transition-all duration-200" />
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-4 px-3">
            <div className="border-t border-neutral-100" />
          </div>

          {/* Catalog Link */}
          <Link
            href="/catalog"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
              text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 
              transition-all duration-200 group"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
            <span className="flex-1">Каталог</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 
              transition-all duration-200" />
          </Link>
        </nav>

        {/* Admin Link */}
        {isAdmin && (
          <div className="p-3 border-t border-neutral-100">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                bg-violet-50 text-violet-700 hover:bg-violet-100 
                transition-all duration-200 group"
            >
              <Shield className="w-5 h-5 text-violet-500" />
              <span className="flex-1">Админ-панель</span>
              <ArrowUpRight className="w-4 h-4 text-violet-400" />
            </Link>
          </div>
        )}

        {/* User Info */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 truncate">
                {session.user.name || "Пользователь"}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}