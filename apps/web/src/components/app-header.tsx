"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Search, Sparkles, User, ChevronDown, Bell, LayoutDashboard, Shield, LogOut, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "motion/react"

const mainNavLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О нас" },
]

const mobileNavLinks = [
  { href: "/catalog", label: "Каталог приложений" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О нас" },
  { href: "/docs", label: "Документация" },
]

const mockNotifications = [
  {
    id: 1,
    title: "Новое обновление приложения",
    description: "Доступно обновление для CRM-системы",
    time: "10 минут назад",
    read: false,
    type: "update"
  },
  {
    id: 2,
    title: "Платеж успешно проведен",
    description: "Списание 4990 ₽ за подписку на Analytics Pro",
    time: "2 часа назад",
    read: true,
    type: "payment"
  },
  {
    id: 3,
    title: "Приглашение в организацию",
    description: "Вас добавили в организацию «ТехноЛаб»",
    time: "Вчера",
    read: false,
    type: "invite"
  },
  {
    id: 4,
    title: "Отзыв опубликован",
    description: "Ваш отзыв на приложение «CRM» одобрен",
    time: "2 дня назад",
    read: true,
    type: "review"
  }
]

function DevTrustLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b6b] via-[#ff8e8e] to-[#ffa8a8] opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] blur-[6px] opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center shadow-lg shadow-red-500/25">
          <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
        </div>
      </div>
      <span className="font-bold text-xl tracking-tight">
        <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] bg-clip-text text-transparent">Dev</span>
        <span className="text-slate-800">Trust</span>
      </span>
    </Link>
  )
}

function AnimatedIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10, delay }}
    >
      {children}
    </motion.div>
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
        setSearchResults([])
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/catalog/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSearchResults(data.apps?.slice(0, 5) || [])
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => performSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?query=${encodeURIComponent(searchQuery)}`
      setSearchOpen(false)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] md:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1200px]"
      >
        <div className={`relative backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/5 rounded-2xl md:rounded-3xl transition-all duration-300 ${scrolled ? 'bg-white/40' : 'bg-white/30'}`}>
          <div className="absolute inset-0 border-t border-white/30 pointer-events-none" />
          <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-[1200px] mx-auto gap-4">
            <div className="flex items-center gap-6">
              <DevTrustLogo />
              <nav className="hidden lg:flex items-center gap-1">
                {mainNavLinks.map((link) => {
                  const isActive = pathname?.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                        isActive
                          ? "text-[#ff6b6b]"
                          : "text-slate-700 hover:text-slate-900 hover:bg-white/30"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white/30 rounded-xl"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
              <div className="relative" ref={searchRef}>
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.div
                      key="search-open"
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="flex items-center"
                    >
                      <form onSubmit={handleSearch} className="flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Поиск приложений..."
                          autoFocus
                          className="w-full h-10 pl-4 pr-10 text-sm bg-white/40 backdrop-blur-md border border-white/30 text-slate-900 placeholder:text-slate-500 focus:border-[#ff6b6b] rounded-2xl transition-all"
                        />
                      </form>
                      <button
                        type="button"
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]) }}
                        className="absolute right-2 p-1.5 text-slate-500 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchOpen(true)}
                      className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/30 rounded-xl transition-all"
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {searchOpen && searchQuery.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      {searchLoading ? (
                        <div className="p-4 text-sm text-slate-500 text-center">Поиск...</div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          {searchResults.map((app) => (
                            <Link
                              key={app.id}
                              href={`/apps/${app.slug}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ecdc4] to-[#6ee7df] flex items-center justify-center text-white font-medium shrink-0">
                                {app.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{app.name}</p>
                                <p className="text-xs text-slate-500 truncate">{app.category?.name}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-sm text-slate-500 text-center">Ничего не найдено</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {session && (
                <div className="relative hidden md:block" ref={notificationsRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNotificationsMenuOpen(!notificationsMenuOpen)}
                    className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/30 rounded-xl transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b6b] rounded-full" />
                  </motion.button>

                  <AnimatePresence>
                    {notificationsMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-white/30">
                          <p className="text-sm font-medium text-slate-900">Уведомления</p>
                          <p className="text-xs text-slate-500">{mockNotifications.filter(n => !n.read).length} непрочитанных</p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {mockNotifications.length === 0 ? (
                            <div className="p-4 text-sm text-slate-500 text-center">Нет уведомлений</div>
                          ) : (
                            mockNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 border-b border-white/30 hover:bg-white/50 transition-colors ${notification.read ? '' : 'bg-blue-50/30'}`}
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                  <span className="text-xs text-slate-500">{notification.time}</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1">{notification.description}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <Link
                          href="/dashboard/notifications"
                          onClick={() => setNotificationsMenuOpen(false)}
                          className="block text-center py-3 text-sm font-medium text-slate-700 hover:bg-white/50 border-t border-white/30 transition-colors"
                        >
                          Все уведомления
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {session ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white/30 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
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
                        className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-white/30">
                          <p className="text-sm font-medium text-slate-900 truncate">{session.user?.name || "Пользователь"}</p>
                          <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-white/50 hover:text-slate-900 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Мой кабинет
                          </Link>
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-white/50 hover:text-slate-900 transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Админ-панель
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-white/30">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Выйти
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white/30 rounded-2xl transition-all"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] text-white rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Регистрация
                  </Link>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-white/30 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mx-3 mt-2"
            >
              <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl">
                <div className="px-4 py-4 space-y-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск приложений..."
                        className="w-full pl-10 pr-4 py-3 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#ff6b6b]"
                      />
                    </div>
                  </form>

                  <nav className="space-y-1">
                    {mobileNavLinks.map((link) => {
                      const isActive = pathname?.startsWith(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-colors",
                            isActive
                              ? "bg-[#ff6b6b]/10 text-[#ff6b6b]"
                              : "text-slate-700 hover:bg-white/50"
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="pt-4 border-t border-white/30 space-y-2">
                    {session ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] text-white font-medium rounded-xl"
                      >
                        <User className="w-5 h-5" />
                        Личный кабинет
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center justify-center w-full px-4 py-3 bg-white/30 backdrop-blur-md border border-white/30 text-slate-700 font-medium rounded-xl"
                        >
                          Войти
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] text-white font-medium rounded-xl"
                        >
                          Регистрация
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a2e] text-white relative overflow-hidden pt-20">
      <div className="absolute -top-20 left-0 right-0 h-20 overflow-hidden">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,75 1440,50 L1440,100 L0,100 Z"
            fill="#1a1a2e"
          />
        </svg>
      </div>

      <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-[#ff6b6b]/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-[#4ecdc4]/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Dev<span className="text-[#ff6b6b]">Trust</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 mb-6 max-w-xs leading-relaxed">
              Платформа для покупки и управления бизнес-приложениями по подписке.
              Всё необходимое для вашего бизнеса в одном месте.
            </p>
            <a href="mailto:support@devtrust.ru" className="text-sm text-[#4ecdc4] hover:text-[#6ee7df] transition-colors">
              support@devtrust.ru
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Продукты</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/catalog" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Каталог</Link></li>
              <li><Link href="/catalog?category=crm" className="text-white/60 hover:text-[#ff6b6b] transition-colors">CRM</Link></li>
              <li><Link href="/catalog?category=documents" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Документы</Link></li>
              <li><Link href="/catalog?category=analytics" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Аналитика</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Компания</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/blog" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Блог</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-[#ff6b6b] transition-colors">О нас</Link></li>
              <li><Link href="/docs/contact" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Документы</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/docs" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Документация</Link></li>
              <li><Link href="/docs/privacy" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Политика</Link></li>
              <li><Link href="/docs/terms" className="text-white/60 hover:text-[#ff6b6b] transition-colors">Оферта</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} DevTrust. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Россия</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Москва</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
