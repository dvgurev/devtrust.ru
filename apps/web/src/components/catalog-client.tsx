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
  Tag
} from "lucide-react"
import { motion } from "motion/react"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

  const hasActiveFilters = category || sort || initialQuery
  const totalPages = Math.ceil(total / 12)
  const displayApps = query ? liveApps : initialApps
  const currentCategory = categories.find(c => c.slug === category)

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Search in Sidebar */}
              <div>
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск приложений..."
                    className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {query && (
                    <button type="button" onClick={handleClear} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  Категории
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/catalog"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      !category && !isFree
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">📦</span>
                    Все приложения
                    <span className="ml-auto text-xs text-slate-400">{allAppsCount || total}</span>
                  </Link>
                  <Link
                    href={`/catalog?isFree=true${category ? `&category=${category}` : ''}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isFree === "true"
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">🎁</span>
                    Бесплатно
                    <span className="ml-auto text-xs text-slate-400">FREE</span>
                  </Link>
                  {categories.map((cat) => {
                    const params = new URLSearchParams()
                    params.set("category", cat.slug)
                    if (isFree) params.set("isFree", isFree)
                    return (
                      <Link
                        key={cat.id}
                        href={`/catalog?${params.toString()}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          category === cat.slug
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                          {cat.slug === 'crm' ? '🔧' : 
                           cat.slug === 'documents' ? '📄' : 
                           cat.slug === 'analytics' ? '📊' : 
                           cat.slug === 'communication' ? '💬' : 
                           cat.slug === 'hr' ? '👥' : 
                           cat.slug === 'finance' ? '💰' : 
                           cat.slug === 'marketing' ? '📈' : 
                           cat.slug === 'support' ? '🎧' : '📦'}
                        </span>
                        {cat.name}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-red-500" />
                  Сортировка
                </h3>
                <div className="space-y-1">
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          isActive
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Бесплатные</span> приложения доступны сразу после регистрации
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Categories Pills */}
            <div className="lg:hidden mb-6 overflow-x-auto flex gap-2 pb-2 -mx-4 px-4">
              <Link
                href="/catalog"
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium ${
                  !category
                    ? "bg-gradient-to-r from-red-400 to-orange-400 text-white"
                    : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                Все
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium ${
                    category === cat.slug
                      ? "bg-gradient-to-r from-red-400 to-orange-400 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">{displayApps.length}</span> из {total}
                </span>
                {isSearching && <span className="text-sm text-red-500">Поиск...</span>}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-700"
                >
                  <Filter className="w-4 h-4" />
                  Фильтры
                  {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                </button>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-gradient-to-r from-red-400 to-orange-400 text-white" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-gradient-to-r from-red-400 to-orange-400 text-white" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(category || sort || isFree) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm">
                    {currentCategory?.name}
                    <button onClick={() => {
                      const params = new URLSearchParams()
                      if (query) params.set("query", query)
                      if (sort) params.set("sort", sort)
                      if (isFree) params.set("isFree", isFree)
                      router.push(`/catalog?${params.toString()}`)
                    }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isFree && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                    Бесплатно
                    <button onClick={() => {
                      const params = new URLSearchParams()
                      if (query) params.set("query", query)
                      if (category) params.set("category", category)
                      if (sort) params.set("sort", sort)
                      router.push(`/catalog?${params.toString()}`)
                    }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sort && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm">
                    {sortOptions.find(o => o.value === sort)?.label}
                    <button onClick={() => {
                      const params = new URLSearchParams()
                      if (query) params.set("query", query)
                      if (category) params.set("category", category)
                      if (isFree) params.set("isFree", isFree)
                      router.push(`/catalog?${params.toString()}`)
                    }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button onClick={handleClear} className="text-sm text-slate-500 hover:text-red-500">
                  Сбросить всё
                </button>
              </div>
            )}

            {/* Grid */}
            {displayApps.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {displayApps.map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={`/apps/${app.slug}`}
                        className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200"
                      >
                        <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 relative">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-bold text-slate-300">{app.name.charAt(0)}</span>
                            </div>
                          )}
                          {app.featured && (
                            <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" />Топ
                            </div>
                          )}
                          {app.isFree && (
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                              Бесплатно
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">{app.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-slate-900 truncate group-hover:text-red-500 transition-colors">
                                {app.name}
                              </h3>
                              {app.category && <span className="text-xs text-slate-500">{app.category.name}</span>}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">{app.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-semibold text-slate-900">{app.averageRating.toFixed(1)}</span>
                              <span className="text-sm text-slate-500">({app.reviewsCount})</span>
                            </div>
                            <span className={`text-sm font-bold ${app.isFree ? "text-emerald-600" : "text-red-500"}`}>
                              {app.isFree ? "Бесплатно" : `от ${app.plans[0]?.price || 0} ₽`}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayApps.map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={`/apps/${app.slug}`}
                        className="group flex items-center gap-5 bg-white rounded-2xl border border-slate-200 p-4 hover:border-red-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="w-10 h-10" />
                          ) : (
                            <span className="text-white font-bold text-xl">{app.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 group-hover:text-red-500 transition-colors">
                              {app.name}
                            </h3>
                            {app.featured && <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Топ</span>}
                            {app.isFree && <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">Бесплатно</span>}
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1 mb-1">{app.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            {app.category && <span className="text-slate-500">{app.category.name}</span>}
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-medium">{app.averageRating.toFixed(1)}</span>
                              <span className="text-slate-500">({app.reviewsCount})</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-lg font-bold ${app.isFree ? "text-emerald-600" : "text-red-500"}`}>
                            {app.isFree ? "Бесплатно" : `от ${app.plans[0]?.price || 0} ₽`}
                          </span>
                          {!app.isFree && <span className="block text-xs text-slate-500">в месяц</span>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-2xl border border-slate-200"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Приложения не найдены</h3>
                <p className="text-slate-500 mb-6">Попробуйте изменить параметры поиска</p>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
                >
                  Сбросить фильтры
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {!query && totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`/catalog?page=${i + 1}${category ? `&category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-red-400 to-orange-400 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-500"
                    }`}
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
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-xl font-semibold text-slate-900">Фильтры</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Категории</h4>
                <div className="space-y-1">
                  <button onClick={() => setMobileCategory("")} className={`w-full text-left px-4 py-3 rounded-xl text-sm ${!mobileCategory ? "bg-red-50 text-red-600 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                    Все приложения
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setMobileCategory(cat.slug)} className={`w-full text-left px-4 py-3 rounded-xl text-sm ${mobileCategory === cat.slug ? "bg-red-50 text-red-600 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Сортировка</h4>
                <div className="space-y-1">
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button key={opt.value} onClick={() => setMobileSort(opt.value)} className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${mobileSort === opt.value ? "bg-red-50 text-red-600 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                        <Icon className="w-4 h-4" />{opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-3">
              <button onClick={clearMobileFilters} className="flex-1 px-5 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">
                Сбросить
              </button>
              <button onClick={applyMobileFilters} className="flex-1 px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-red-400 to-orange-400 rounded-xl hover:shadow-lg">
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}