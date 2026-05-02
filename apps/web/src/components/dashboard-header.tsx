"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronDown, Building2, AppWindow, Bell, User, MessageSquare, Settings, LogOut, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface Organization {
  id: string
  name: string
}

const navItems = [
  { href: "/dashboard/apps", label: "Мои приложения", icon: AppWindow },
  { href: "/dashboard/notifications", label: "Уведомления", icon: Bell },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
  { href: "/dashboard/reviews", label: "Мои отзывы", icon: MessageSquare },
  { href: "/dashboard/subscriptions", label: "Подписки", icon: Settings },
]

export function DashboardHeader({
  organizations,
  currentOrgId,
  userName,
}: {
  organizations: Organization[]
  currentOrgId: string
  userName?: string
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const currentOrg = organizations.find((o) => o.id === currentOrgId)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest(".organization-switcher")) {
        setIsOpen(false)
      }
      if (!target.closest(".user-menu")) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] md:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1200px]"
    >
      <div className="bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 rounded-2xl md:rounded-3xl">
        <div className="flex items-center justify-between h-14 px-4 max-w-[1200px] mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5"
          >
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#1a1a2e]">
                <span className="text-[#ff6b6b]">Dev</span>
                <span>Trust</span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1a1a2e] hover:bg-slate-100 rounded-xl transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard/notifications"
                className="relative p-2.5 text-slate-600 hover:text-[#1a1a2e] hover:bg-slate-100 rounded-xl transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b6b] rounded-full" />
              </Link>
            </motion.div>

            <div className="relative user-menu" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center text-white text-sm font-medium">
                  {userName?.charAt(0) || "U"}
                </div>
                <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{userName || "Пользователь"}</p>
                    </div>
                    <div className="py-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    {organizations.length > 1 && (
                      <div className="border-t border-slate-100 px-4 py-3">
                        <p className="text-xs font-medium text-slate-500 mb-2">Организация</p>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="flex-1 text-left truncate">{currentOrg?.name || "Организация"}</span>
                          <ChevronDown className={`w-4 h-4 transition ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-2 space-y-1"
                            >
                              {organizations.map((org) => (
                                <button
                                  key={org.id}
                                  onClick={() => {
                                    router.push(`/dashboard/switch-org?org=${org.id}`)
                                    setIsOpen(false)
                                  }}
                                  className={cn(
                                    "w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                                    org.id === currentOrgId
                                      ? "bg-red-50 text-[#ff6b6b] font-medium"
                                      : "hover:bg-slate-50 text-slate-600"
                                  )}
                                >
                                  {org.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    <div className="border-t border-slate-100">
                      <form action="/api/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Выйти
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}