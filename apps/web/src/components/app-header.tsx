"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Search, Bell, LogOut, LayoutDashboard, Shield, ChevronDown, Sparkles, Zap, User } from "lucide-react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

// ==================== Константы ====================
const SEARCH_MIN_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 300
const SEARCH_RESULTS_LIMIT = 5

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О нас" },
] as const

// ==================== Хуки ====================
function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    abortRef.current?.abort()

    if (!searchQuery.trim() || searchQuery.length < SEARCH_MIN_LENGTH) {
      setResults([])
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)

    try {
      const res = await fetch(
        `/api/catalog/search?query=${encodeURIComponent(searchQuery)}&limit=${SEARCH_RESULTS_LIMIT}`,
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.apps || [])
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), SEARCH_DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [query, search])

  const clear = useCallback(() => {
    setQuery("")
    setResults([])
  }, [])

  return { query, setQuery, results, loading, clear }
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [ref, handler])
}

function useKeyboard(key: string, handler: () => void) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key) handler()
    }
    document.addEventListener("keydown", listener)
    return () => document.removeEventListener("keydown", listener)
  }, [key, handler])
}

// ==================== Компоненты ====================
function Logo() {
  return (
    <Link
      href="/"
      className="group relative flex items-center gap-2.5 no-underline"
      aria-label="DevTrust - на главную"
    >
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center
        group-hover:scale-105 transition-transform duration-300
        shadow-sm border border-neutral-200">
        <span className="text-neutral-900 font-black text-xl leading-none">D</span>
      </div>
      <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
        DevTrust
      </span>
    </Link>
  )
}

function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center gap-1", className)} role="navigation">
      {NAV_LINKS.map((link) => {
        const isActive = pathname?.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

function SearchBar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean
  onToggle: () => void
}) {
  const router = useRouter()
  const { query, setQuery, results, loading, clear } = useSearch()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useClickOutside(ref, () => isOpen && onToggle())
  useKeyboard("Escape", () => isOpen && onToggle())

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/catalog?query=${encodeURIComponent(query)}`)
      onToggle()
    }
  }

  return (
    <div className="relative" ref={ref}>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="p-2.5 text-neutral-500 hover:text-neutral-900 rounded-xl 
            transition-all duration-300 hover:bg-neutral-100"
          aria-label="Открыть поиск"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск приложений..."
                className="w-72 lg:w-80 pl-10 pr-10 py-2.5 text-sm bg-white 
                  border border-neutral-200 rounded-xl
                  text-neutral-900 placeholder:text-neutral-400
                  focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 
                  outline-none transition-all duration-300 shadow-lg"
              />
              <button
                type="button"
                onClick={onToggle}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
                  text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                aria-label="Закрыть поиск"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Результаты поиска */}
          {query.length >= SEARCH_MIN_LENGTH && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white 
              border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent 
                    rounded-full animate-spin mx-auto" />
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {results.map((app) => (
                    <Link
                      key={app.id}
                      href={`/apps/${app.slug}`}
                      onClick={onToggle}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 
                        transition-colors duration-200"
                    >
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center 
                        justify-center text-neutral-900 font-bold text-lg">
                        {app.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-900 truncate">{app.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{app.category?.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-neutral-500">
                  Ничего не найдено
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UserMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setIsOpen(false))
  useKeyboard("Escape", () => setIsOpen(false))

  const userName = session.user?.name || "Пользователь"
  const userEmail = session.user?.email
  const userInitial = session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 
          transition-all duration-300"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Меню пользователя"
      >
        <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center 
          text-white font-bold text-sm">
          {userInitial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white 
          border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Информация о пользователе */}
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-bold text-neutral-900">{userName}</p>
            <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
            {session.user?.role === "ADMIN" && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 
                bg-neutral-900 text-white rounded-lg text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                Админ
              </span>
            )}
          </div>

          {/* Ссылки */}
          <div className="py-1">
            <MenuLink
              href="/dashboard"
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Личный кабинет"
              onClick={() => setIsOpen(false)}
            />
            {session.user?.role === "ADMIN" && (
              <MenuLink
                href="/admin"
                icon={<Shield className="w-4 h-4" />}
                label="Админ-панель"
                onClick={() => setIsOpen(false)}
              />
            )}
          </div>

          {/* Выход */}
          <div className="border-t border-neutral-100">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: "/" })
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  href,
  icon,
  label,
  onClick
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium
        text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 
        transition-colors duration-200"
      role="menuitem"
    >
      <span className="text-neutral-400">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function MobileMenu({
  isOpen,
  onClose,
  session
}: {
  isOpen: boolean
  onClose: () => void
  session: any
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?query=${encodeURIComponent(searchQuery)}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed inset-x-4 top-20 bg-white rounded-3xl shadow-2xl z-50 
        max-h-[80vh] overflow-y-auto border border-neutral-200">
        <div className="p-6 space-y-6">
          {/* Поиск */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск приложений..."
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 
                  rounded-2xl text-neutral-900 placeholder:text-neutral-400
                  focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 
                  outline-none transition-all duration-300"
              />
            </div>
          </form>

          {/* Навигация */}
          <nav className="space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname?.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-2xl font-bold text-lg transition-all duration-300",
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Действия */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 
                    bg-neutral-900 text-white rounded-2xl font-bold text-lg
                    hover:bg-neutral-800 transition-all duration-300"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Личный кабинет
                </Link>
                <button
                  onClick={() => {
                    onClose()
                    signOut({ callbackUrl: "/" })
                  }}
                  className="w-full px-5 py-3.5 text-red-600 font-bold text-lg
                    hover:bg-red-50 rounded-2xl transition-all duration-300"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center w-full px-5 py-3.5 
                    border-2 border-neutral-200 text-neutral-900 rounded-2xl font-bold text-lg
                    hover:bg-neutral-50 transition-all duration-300"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center w-full px-5 py-3.5 
                    bg-neutral-900 text-white rounded-2xl font-bold text-lg
                    hover:bg-neutral-800 transition-all duration-300"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== Главный компонент ====================
export function AppHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Левая часть - пустая для баланса */}
            <div className="hidden lg:flex flex-1">
              <NavLinks />
            </div>

            {/* Логотип по центру */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Правая часть - иконки */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* Поиск */}
              <SearchBar
                isOpen={searchOpen}
                onToggle={() => setSearchOpen(!searchOpen)}
              />

              {/* Уведомления */}
              <button
                className="hidden sm:flex relative p-2.5 text-neutral-500 hover:text-neutral-900 
                  rounded-xl transition-all duration-300 hover:bg-neutral-100"
                aria-label="Уведомления"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Пользователь или кнопки входа */}
              <div className="hidden lg:flex items-center gap-2">
                {session ? (
                  <UserMenu session={session} />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 
          hover:bg-neutral-100 rounded-full transition-all duration-300"
                    >
                      Войти
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2.5 text-sm font-bold text-white bg-neutral-900 
          hover:bg-neutral-800 rounded-full transition-all duration-300"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>

              {/* Мобильное меню */}
              <button
                className="lg:hidden p-2.5 text-neutral-500 hover:text-neutral-900 
                  rounded-xl transition-all duration-300 hover:bg-neutral-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Меню"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        session={session}
      />
    </>
  )
}

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = useMemo(() => ({

    company: [
      { href: "/blog", label: "Блог" },
      { href: "/about", label: "О компании" },
      { href: "/docs/contact", label: "Контакты" },
    ],
    legal: [
      { href: "/docs", label: "Документация" },
      { href: "/docs/privacy", label: "Конфиденциальность" },
      { href: "/docs/terms", label: "Условия" },
    ],
  }), [])

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Бренд */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 no-underline">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-neutral-900 font-black text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-white">DevTrust</span>
            </Link>

            <p className="text-neutral-400 leading-relaxed mb-6 max-w-sm">
              Платформа для бизнес-приложений по подписке.
              Всё для вашего бизнеса в одном месте.
            </p>

            <a
              href="mailto:support@devtrust.ru"
              className="inline-flex items-center gap-2 text-neutral-300 hover:text-white 
                transition-colors duration-300"
            >
              <span className="text-lg">✉️</span>
              <span>support@devtrust.ru</span>
            </a>
          </div>

          {/* Секции */}

          <FooterSection title="Компания" links={footerLinks.company} />
          <FooterSection title="Документы" links={footerLinks.legal} />
        </div>

        {/* Нижняя часть */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row 
          justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {currentYear} DevTrust. Все права защищены.
          </p>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>🇷🇺 Россия</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>Омск</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({ title, links }: {
  title: string
  links: readonly { href: string; label: string }[]
}) {
  return (
    <div>
      <h4 className="font-bold text-white mb-5">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-neutral-400 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}