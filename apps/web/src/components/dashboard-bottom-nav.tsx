// apps/web/src/components/dashboard-bottom-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, AppWindow, CreditCard, Bell, User, ShoppingBag } from "lucide-react"

const bottomItems = [
    { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
    { href: "/dashboard/apps", label: "Приложения", icon: AppWindow },
    { href: "/catalog", label: "Каталог", icon: ShoppingBag },
    { href: "/dashboard/billing", label: "Платежи", icon: CreditCard },
    { href: "/dashboard/profile", label: "Профиль", icon: User },
]

export function DashboardBottomNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 px-2 rounded-xl transition-colors
                ${isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}