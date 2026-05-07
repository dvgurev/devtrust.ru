"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Star,
  Search,
  X,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Clock,
  ChevronRight,
  Grid3X3,
  LayoutList,
  Zap,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface App {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
  isFree: boolean
  averageRating: number
  reviewsCount: number
  category: { name: string; slug: string } | null
  plans: { price: number }[]
  featured?: boolean | null
}

interface Category {
  id: string
  slug: string
  name: string
}

export function CatalogClient({
  apps: initialApps,
  categories,
  total,
  allAppsCount,
  category,
  query: initialQuery,
  sort,
  isFree,
  currentPage,
}: {
  apps: App[]
  categories: Category[]
  total: number
  allAppsCount?: number
  category?: string
  query?: string
  sort?: string
  isFree?: string
  currentPage: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery || "")
  const [liveApps, setLiveApps] = useState(initialApps)
  const [isSearching, setIsSearching] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileCategory, setMobileCategory] = useState(category || "")
  const [mobileSort, setMobileSort] = useState(sort || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const sortOptions = [
    { value: "", label: "Популярные", icon: TrendingUp },
    { value: "newest", label: "Новые", icon: Clock },
    { value: "price_asc", label: "Дешевые", icon: ArrowUpDown },
    { value: "rating", label: "Рейтинг", icon: Star },
  ]

  const liveSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setLiveApps(initialApps)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const params = new URLSearchParams()
    if (searchQuery) params.set("query", searchQuery)
    if (category) params.set("category", category)
    if (sort) params.set("sort", sort)
    if (isFree) params.set("isFree", isFree)

    try {
      const res = await fetch(`/api/catalog/search?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLiveApps(data.apps)
      }
    } catch {
      setLiveApps(initialApps)
    } finally {
      setIsSearching(false)
    }
  }, [category, sort, isFree, initialApps])

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => liveSearch(query), 300)
    setDebounceTimer(timer)
    return () => clearTimeout(timer)
  }, [query, liveSearch])

  const handleClear = () => {
    setQuery("")
    setLiveApps(initialApps)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("query")
    router.push(`/catalog?${params.toString()}`)
  }

  const applyMobileFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    if (mobileCategory) params.set("category", mobileCategory)
    if (mobileSort) params.set("sort", mobileSort)
    router.push(`/catalog?${params.toString()}`)
    setMobileFilterOpen(false)
  }

  const clearMobileFilters = () => {
    setMobileCategory("")
    setMobileSort("")
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    router.push(`/catalog?${params.toString()}`)
    setMobileFilterOpen(false)
  }

  const hasActiveFilters = !!(category || sort || initialQuery)
  const totalPages = Math.ceil(total / 12)
  const displayApps = query ? liveApps : initialApps
  const currentCategory = categories.find(c => c.slug === category)

  const getCategoryEmoji = (slug: string) => {
    const emojis: Record<string, string> = {
      crm: '🤝', documents: '📄', analytics: '📊',
      communication: '💬', hr: '👥', finance: '💰',
      marketing: '📈', support: '🎧'
    }
    return emojis[slug] || '📦'
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Banner */}
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
              Каталог приложений
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              {currentCategory
                ? <>{currentCategory.name}</>
                : <>Найдите <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">идеальное</span> приложение</>
              }
            </h1>
            <p className="text-lg text-neutral-400">
              {total} {total === 1 ? 'приложение' : total < 5 ? 'приложения' : 'приложений'} доступно для вашего бизнеса
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск приложений..."
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-neutral-200 
                    rounded-2xl text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 
                      flex items-center justify-center rounded-full
                      text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100
                      transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Категории
                </h3>
                <div className="space-y-1.5">
                  <Link
                    href="/catalog"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium",
                      !category && !isFree
                        ? "bg-violet-50 text-violet-700"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <span className="text-xl">📦</span>
                    <span className="flex-1">Все приложения</span>
                    <span className="text-sm text-neutral-400">{allAppsCount || total}</span>
                  </Link>
                  <Link
                    href={`/catalog?isFree=true${category ? `&category=${category}` : ''}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium",
                      isFree === "true"
                        ? "bg-violet-50 text-violet-700"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <span className="text-xl">🎁</span>
                    <span className="flex-1">Бесплатно</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">FREE</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.slug}${isFree ? `&isFree=${isFree}` : ''}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium",
                        category === cat.slug
                          ? "bg-violet-50 text-violet-700"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      )}
                    >
                      <span className="text-xl">{getCategoryEmoji(cat.slug)}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Сортировка
                </h3>
                <div className="space-y-1.5">
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon
                    const isActive = (!sort && !opt.value) || sort === opt.value
                    const params = new URLSearchParams()
                    if (query) params.set("query", query)
                    if (category) params.set("category", category)
                    if (isFree) params.set("isFree", isFree)
                    if (opt.value) params.set("sort", opt.value)
                    return (
                      <Link
                        key={opt.value}
                        href={`/catalog?${params.toString()}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium",
                          isActive
                            ? "bg-violet-50 text-violet-700"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Info card */}
              <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 border border-violet-100">
                <Sparkles className="w-8 h-8 text-violet-500 mb-3" />
                <p className="text-sm font-medium text-violet-900 leading-relaxed">
                  Бесплатные приложения доступны сразу после регистрации. Никаких скрытых платежей.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Categories Pills */}
            <div className="lg:hidden mb-6 overflow-x-auto flex gap-2 pb-2 -mx-2 px-2">
              <Link
                href="/catalog"
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300",
                  !category
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                )}
              >
                Все
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className={cn(
                    "flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300",
                    category === cat.slug
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">
                  <span className="font-bold text-neutral-900">{displayApps.length}</span> из {total} приложений
                </span>
                {isSearching && (
                  <span className="flex items-center gap-1.5 text-sm text-violet-600">
                    <span className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                    Поиск...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-full 
                    font-medium text-sm border border-neutral-200 hover:border-neutral-300
                    transition-all duration-300"
                >
                  <Filter className="w-4 h-4" />
                  Фильтры
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-violet-600 rounded-full" />
                  )}
                </button>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-white rounded-full p-1 border border-neutral-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      viewMode === "grid" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      viewMode === "list" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"
                    )}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <AnimatePresence>
              {(category || sort || isFree) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2 mb-6 overflow-hidden"
                >
                  {category && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 
                      bg-violet-50 text-violet-700 rounded-full font-medium text-sm">
                      {currentCategory?.name}
                      <button onClick={() => {
                        const params = new URLSearchParams()
                        if (query) params.set("query", query)
                        if (sort) params.set("sort", sort)
                        if (isFree) params.set("isFree", isFree)
                        router.push(`/catalog?${params.toString()}`)
                      }}>
                        <X className="w-3.5 h-3.5 hover:text-violet-900" />
                      </button>
                    </span>
                  )}
                  {isFree && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 
                      bg-green-50 text-green-700 rounded-full font-medium text-sm">
                      Бесплатно
                      <button onClick={() => {
                        const params = new URLSearchParams()
                        if (query) params.set("query", query)
                        if (category) params.set("category", category)
                        if (sort) params.set("sort", sort)
                        router.push(`/catalog?${params.toString()}`)
                      }}>
                        <X className="w-3.5 h-3.5 hover:text-green-900" />
                      </button>
                    </span>
                  )}
                  {sort && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 
                      bg-violet-50 text-violet-700 rounded-full font-medium text-sm">
                      {sortOptions.find(o => o.value === sort)?.label}
                      <button onClick={() => {
                        const params = new URLSearchParams()
                        if (query) params.set("query", query)
                        if (category) params.set("category", category)
                        if (isFree) params.set("isFree", isFree)
                        router.push(`/catalog?${params.toString()}`)
                      }}>
                        <X className="w-3.5 h-3.5 hover:text-violet-900" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClear}
                    className="text-sm text-neutral-400 hover:text-neutral-900 font-medium transition-colors ml-2"
                  >
                    Сбросить всё
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Apps Grid/List */}
            {displayApps.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayApps.map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      <Link
                        href={`/apps/${app.slug}`}
                        className="group block bg-white rounded-3xl overflow-hidden
                          border border-neutral-100 hover:border-violet-200
                          hover:shadow-2xl hover:shadow-violet-500/5
                          transition-all duration-500 hover:-translate-y-1"
                      >
                        {/* Image placeholder */}
                        <div className="relative aspect-video bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100
                          flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-pink-500/0 
                            group-hover:from-violet-500/10 group-hover:to-pink-500/10 
                            transition-all duration-500" />
                          <span className="text-6xl font-black text-violet-300/40 group-hover:text-violet-400/60 
                            group-hover:scale-110 transition-all duration-500 relative z-10">
                            {app.name.charAt(0)}
                          </span>

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            {app.featured && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 
                                bg-neutral-900 text-white rounded-full text-xs font-bold
                                shadow-lg">
                                <Zap className="w-3 h-3" /> Топ
                              </span>
                            )}
                            {app.isFree && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 
                                bg-green-500 text-white rounded-full text-xs font-bold
                                shadow-lg">
                                Бесплатно
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0
                              group-hover:bg-violet-100 transition-colors duration-500">
                              <span className="text-violet-600 font-bold text-lg">{app.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1">
                              <h3 className="font-bold text-lg text-neutral-900 group-hover:text-violet-700 
                                transition-colors truncate">
                                {app.name}
                              </h3>
                              {app.category && (
                                <span className="text-sm text-neutral-400">{app.category.name}</span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-5">
                            {app.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-neutral-900">{app.averageRating.toFixed(1)}</span>
                              <span className="text-sm text-neutral-400">({app.reviewsCount})</span>
                            </div>
                            <span className={cn(
                              "font-bold text-lg",
                              app.isFree ? "text-green-600" : "text-neutral-900"
                            )}>
                              {app.isFree ? "Бесплатно" : `от ${app.plans[0]?.price || 0} ₽`}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayApps.map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      <Link
                        href={`/apps/${app.slug}`}
                        className="group flex items-center gap-6 bg-white rounded-2xl p-5
                          border border-neutral-100 hover:border-violet-200
                          hover:shadow-lg transition-all duration-300"
                      >
                        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0
                          group-hover:bg-violet-100 transition-colors duration-300">
                          <span className="text-violet-600 font-bold text-xl">{app.name.charAt(0)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-neutral-900 group-hover:text-violet-700 transition-colors">
                              {app.name}
                            </h3>
                            {app.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 
                                bg-neutral-900 text-white rounded-full text-[10px] font-bold">
                                <Zap className="w-2.5 h-2.5" /> Топ
                              </span>
                            )}
                            {app.isFree && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 
                                bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                                Бесплатно
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 line-clamp-1 mb-1">{app.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            {app.category && <span className="text-neutral-400">{app.category.name}</span>}
                            <span className="flex items-center gap-1 text-neutral-600">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-medium">{app.averageRating.toFixed(1)}</span>
                              <span className="text-neutral-400">({app.reviewsCount})</span>
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={cn(
                            "text-xl font-bold",
                            app.isFree ? "text-green-600" : "text-neutral-900"
                          )}>
                            {app.isFree ? "Бесплатно" : `от ${app.plans[0]?.price || 0} ₽`}
                          </span>
                          {!app.isFree && (
                            <span className="block text-xs text-neutral-400">в месяц</span>
                          )}
                        </div>

                        <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-violet-500 
                          group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                          transition-all duration-300 flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-neutral-100"
              >
                <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Ничего не найдено</h3>
                <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                  Попробуйте изменить параметры поиска или сбросить фильтры
                </p>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-6 py-3 
                    bg-neutral-900 text-white rounded-full font-medium
                    hover:bg-neutral-800 transition-all duration-300"
                >
                  Сбросить фильтры
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {!query && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`/catalog?page=${i + 1}${category ? `&category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full font-medium text-sm transition-all duration-300",
                      currentPage === i + 1
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
                    )}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
                <h3 className="text-lg font-bold text-neutral-900">Фильтры</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                    bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Категории</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileCategory("")}
                      className={cn(
                        "w-full text-left px-5 py-3.5 rounded-2xl font-medium transition-all",
                        !mobileCategory
                          ? "bg-violet-50 text-violet-700"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      Все приложения
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMobileCategory(cat.slug)}
                        className={cn(
                          "w-full text-left px-5 py-3.5 rounded-2xl font-medium transition-all",
                          mobileCategory === cat.slug
                            ? "bg-violet-50 text-violet-700"
                            : "text-neutral-600 hover:bg-neutral-50"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Сортировка</h4>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => {
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setMobileSort(opt.value)}
                          className={cn(
                            "w-full text-left px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium transition-all",
                            mobileSort === opt.value
                              ? "bg-violet-50 text-violet-700"
                              : "text-neutral-600 hover:bg-neutral-50"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4 flex gap-3">
                <button
                  onClick={clearMobileFilters}
                  className="flex-1 px-5 py-3.5 rounded-2xl font-medium border border-neutral-200
                    text-neutral-700 hover:bg-neutral-50 transition-all"
                >
                  Сбросить
                </button>
                <button
                  onClick={applyMobileFilters}
                  className="flex-1 px-5 py-3.5 rounded-2xl font-medium 
                    bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}