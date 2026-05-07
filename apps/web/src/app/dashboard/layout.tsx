import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, AppWindow, Bell, User, Settings, LayoutDashboard, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/dashboard/apps", label: "Мои приложения" },
  { href: "/dashboard/subscriptions", label: "Подписки" },
  { href: "/dashboard/billing", label: "История платежей" },
  { href: "/dashboard/notifications", label: "Уведомления" },
  { href: "/dashboard/profile", label: "Профиль" },
  { href: "/dashboard/reviews", label: "Мои отзывы" },
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-border p-6 flex flex-col h-screen sticky top-0">
        <div className="font-display text-2xl mb-12 pb-4 border-b-2 border-border">
          <Link href="/dashboard" className="text-fg no-underline hover:no-underline">Кабинет</Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-fg hover:border-fg border-2 border-transparent transition-all"
              >
                <span className="w-5">{item.label.charAt(0)}</span>
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            )
          })}

          <div className="my-4 border-t-2 border-border"></div>

          <Link
            href="/catalog"
            className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-fg hover:border-fg border-2 border-transparent transition-all"
          >
            <span className="w-5">К</span>
            <span className="flex-1 text-left">Каталог</span>
          </Link>
        </nav>

        {isAdmin && (
          <div className="pt-4 border-t-2 border-border">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-fg hover:border-fg border-2 border-transparent transition-all"
            >
              <span className="w-5">А</span>
              <span className="flex-1 text-left">Админ-панель</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
