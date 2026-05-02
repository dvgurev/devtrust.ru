"use client"

import Link from "next/link"
import { Star, Download, ExternalLink, Check, Clock, Building2, ArrowRight, ArrowLeft, Filter, Zap, MessageSquare, Calendar, ChevronRight, Image } from "lucide-react"
import { motion } from "motion/react"
import { ReviewForm } from "@/components/review-form"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface App {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
  isFree: boolean
  averageRating: number
  reviewsCount: number
  featured: boolean | null
  status: string
  subdomain: string | null
  createdAt: Date
  updatedAt: Date
  category: { name: string; slug: string } | null
  plans: { id: string; name: string; price: number; slug: string; features: unknown }[]
  screenshots: { id: string; url: string; sortOrder: number }[]
  changelogs: { id: string; version: string; description: string; releasedAt: Date; isLatest: boolean }[]
  reviews: {
    id: string
    rating: number
    text: string | null
    createdAt: Date
    user: { id: string; name: string | null; email: string | null }
    reply: { text: string } | null
  }[]
}

interface Review {
  id: string
  rating: number
  text: string | null
}

interface AppPageClientProps {
  app: App
  userReview: Review | null
  distribution: { rating: number; count: number }[]
  totalReviews: number
}

export function AppPageClient({ app, userReview, distribution, totalReviews }: AppPageClientProps) {
  const { data: session, status } = useSession()
  const [reviewSort, setReviewSort] = useState("newest")
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [installing, setInstalling] = useState(false)
  const [appStatus, setAppStatus] = useState<{ installed: boolean; redirect: string | null }>({ installed: false, redirect: null })

  const isOwnReview = (reviewUserId: string) => session?.user?.id === reviewUserId

  useEffect(() => {
    if (app.isFree && session?.user) {
      fetch(`/api/apps/${app.slug}/status`)
        .then(res => res.json())
        .then(data => setAppStatus(data))
        .catch(console.error)
    }
  }, [app.slug, app.isFree, session])

  const handleInstallFree = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log("handleInstallFree called", { session: session?.user, status })
    
    if (status === "loading") return
    
    if (!session?.user) {
      console.log("No session, redirecting to login")
      window.location.href = `/login?redirect=/apps/${app.slug}`
      return
    }
    
    setInstalling(true)
    try {
      const res = await fetch(`/api/apps/${app.slug}/install`, {
        method: "POST",
      })
      const data = await res.json()
      console.log("Install response:", res.status, data)
      
      if (res.ok && data.redirect) {
        window.location.href = data.redirect
      } else if (data.error === "App already installed" && data.redirect) {
        window.location.href = data.redirect
      } else {
        alert(data.error || "Ошибка при установке")
      }
    } catch (error) {
      console.error(error)
      alert("Ошибка при установке")
    } finally {
      setInstalling(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 mb-8"
          >
            <Link href="/" className="hover:text-red-500">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/catalog" className="hover:text-red-500">Каталог</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">{app.name}</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {app.iconUrl ? (
                <img src={app.iconUrl} alt={app.name} className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl shadow-xl" />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-red-400 to-orange-400 rounded-2xl shadow-xl shadow-red-500/25 flex items-center justify-center">
                  <span className="text-4xl lg:text-5xl font-bold text-white">{app.name[0]}</span>
                </div>
              )}
            </motion.div>
            
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {app.category && (
                  <span className="px-4 py-1.5 bg-white/60 backdrop-blur-xl border border-white/40 text-slate-600 rounded-full text-sm font-medium">
                    {app.category.name}
                  </span>
                )}
                {app.status === "MAINTENANCE" && (
                  <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    На обслуживании
                  </span>
                )}
                {app.featured && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />Популярное
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{app.name}</h1>
              <p className="text-lg text-slate-600 mb-6 max-w-2xl">{app.description}</p>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-slate-900">{app.averageRating.toFixed(1)}</span>
                  <span className="text-slate-500">({app.reviewsCount} отзывов)</span>
                </div>
                
                {app.isFree ? (
                  <Link
                    href={`/apps/${app.slug}/buy`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Начать использовать
                  </Link>
                ) : (
                  <Link
                    href={`/apps/${app.slug}/buy`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
                  >
                    Купить от {app.plans[0]?.price || 0} ₽/мес
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 space-y-6">
            {/* Screenshots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Скриншоты</h2>
              {app.screenshots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.screenshots.map((screenshot) => (
                    <img
                      key={screenshot.id}
                      src={screenshot.url}
                      alt={app.name}
                      className="rounded-xl border border-slate-200 hover:border-red-300 transition-colors"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Image className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium mb-1">Скриншоты пока не добавлены</p>
                  <p className="text-sm text-slate-400">Мы работаем над добавлением изображений интерфейса</p>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Описание</h2>
              <div className="prose max-w-none text-slate-600">
                {app.description || <p className="text-slate-400">Описание отсутствует</p>}
              </div>
            </motion.div>

            {/* Changelog */}
            {app.changelogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-400" />
                  Обновления
                </h2>
                <div className="space-y-6">
                  {app.changelogs.map((changelog) => (
                    <div key={changelog.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-lg text-sm font-medium">
                          v{changelog.version}
                        </span>
                        {changelog.isLatest && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                            Текущая версия
                          </span>
                        )}
                        <span className="text-sm text-slate-400">
                          {changelog.releasedAt?.toLocaleDateString("ru")}
                        </span>
                      </div>
                      <p className="text-slate-600">{changelog.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-400" />
                  Отзывы
                  <span className="text-sm font-normal text-slate-500">({totalReviews})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-red-400 focus:border-red-300"
                    aria-label="Сортировка отзывов"
                  >
                    <option value="newest">Сначала новые</option>
                    <option value="highest">Сначала высокие</option>
                    <option value="lowest">Сначала низкие</option>
                  </select>
                </div>
              </div>

              {/* Rating Distribution - Modern Design */}
              {totalReviews > 0 && (
                <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Big Rating */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        {app.averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(app.averageRating) ? "text-amber-500 fill-amber-500" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-slate-500 mt-2">{totalReviews} отзывов</div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 space-y-2 w-full">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const item = distribution.find(d => d.rating === rating)
                        const count = item?.count || 0
                        const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 w-4">{rating}</span>
                            <Star className="w-4 h-4 text-amber-400" />
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                              />
                            </div>
                            <span className="text-sm text-slate-500 w-8 text-right">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {app.reviews.length > 0 ? (
                <div className="space-y-4 mt-8">
                  {app.reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 bg-white/60 rounded-2xl border transition-all duration-200 ${
                        editingReviewId === review.id 
                          ? "border-red-300 shadow-md ring-2 ring-red-100" 
                          : "border-slate-100 hover:border-red-200 hover:shadow-md cursor-pointer"
                      }`}
                      onClick={() => isOwnReview(review.user.id as string) && setEditingReviewId(editingReviewId === review.id ? null : review.id)}
                    >
                      {editingReviewId === review.id ? (
<div onClick={(e) => e.stopPropagation()}>
                          <ReviewForm 
                            appId={app.id} 
                            existingReview={{
                              id: review.id,
                              rating: review.rating,
                              text: review.text
                            }} 
                            onCancel={() => setEditingReviewId(null)}
                            onSuccess={() => setEditingReviewId(null)}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-medium">
                                {(review.user.name || review.user.email || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900">
                                    {review.user.name || review.user.email?.split("@")[0] || "Аноним"}
                                  </span>
                                  {isOwnReview(review.user.id as string) && (
                                    <span className="text-xs text-red-500">(ваш отзыв)</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-slate-400">
                                    {review.createdAt?.toLocaleDateString("ru")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isOwnReview(review.user.id as string) && (
                              <span className="text-xs text-red-400">Нажмите для редактирования</span>
                            )}
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {review.text || "Пользователь не оставил текстовый комментарий"}
                          </p>
                          {review.reply && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-semibold text-emerald-700">Ответ разработчика</span>
                              </div>
                              <p className="text-sm text-slate-700">{review.reply.text}</p>
                            </motion.div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Отзывов пока нет</p>
                  <p className="text-sm text-slate-400 mt-1">Будьте первым, кто оставит отзыв!</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            {/* Pricing or Free Info - without sticky to avoid overlap */}
            {app.isFree ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`border rounded-2xl p-6 ${
                  appStatus.installed 
                    ? "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300" 
                    : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    appStatus.installed ? "bg-emerald-200" : "bg-emerald-100"
                  }`}>
                    <Download className={`w-5 h-5 ${appStatus.installed ? "text-emerald-700" : "text-emerald-600"}`} />
                  </div>
                  <h3 className="font-bold text-emerald-900">
                    {appStatus.installed ? "Подключено" : "Бесплатно"}
                  </h3>
                </div>
                {appStatus.installed ? (
                  <>
                    <p className="text-sm text-emerald-700 mb-4">
                      Приложение успешно подключено! Перейдите в него для начала работы.
                    </p>
                    <a
                      href={appStatus.redirect || "#"}
                      className="block w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      Перейти в приложение
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-emerald-700 mb-4">
                      Это приложение доступно бесплатно. Начните использовать его прямо сейчас!
                    </p>
                    <button
                      onClick={handleInstallFree}
                      disabled={installing}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      {installing ? "Подключение..." : "Начать использовать"}
                    </button>
                  </>
                )}
              </motion.div>
            ) : app.plans.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
              >
                <h3 className="font-bold text-slate-900 mb-4">Тарифы</h3>
                <div className="space-y-4">
                  {app.plans.map((p) => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          <p className="text-2xl font-bold text-slate-900">{p.price} ₽<span className="text-sm font-normal text-slate-400">/мес</span></p>
                        </div>
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>
                      {(() => {
                        const feats = p.features as string[] | null
                        if (!feats || !Array.isArray(feats) || feats.length === 0) return null
                        return (
                          <div className="mb-4 space-y-1.5">
                            {(expandedPlan === p.id ? feats : feats.slice(0, 3)).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {feats.length > 3 && (
                              <button
                                onClick={() => setExpandedPlan(expandedPlan === p.id ? null : p.id)}
                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                              >
                                {expandedPlan === p.id ? "Скрыть" : `+ ещё ${feats.length - 3} возможностей`}
                              </button>
                            )}
                          </div>
                        )
                      })()}
                      <Link
                        href={`/apps/${app.slug}/buy?plan=${p.slug}`}
                        className="block w-full py-2.5 bg-gradient-to-r from-red-400 to-orange-400 text-white text-center font-medium rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all"
                      >
                        Выбрать
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
              >
                <p className="text-slate-500">Тарифы не найдены</p>
              </motion.div>
            )}

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
            >
              <h3 className="font-bold text-slate-900 mb-4">Информация</h3>
              <dl className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Категория</dt>
                    <dd className="font-medium text-slate-900">{app.category?.name || "—"}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Рейтинг</dt>
                    <dd className="font-medium text-slate-900">{app.averageRating.toFixed(1)} / 5</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Обновлено</dt>
                    <dd className="font-medium text-slate-900">{app.updatedAt?.toLocaleDateString("ru")}</dd>
                  </div>
                </div>
                {app.subdomain && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <dt className="text-sm text-slate-500">Сайт</dt>
                      <dd>
                        <a
                          href={`https://${app.subdomain}.devtrust.ru`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-500 font-medium hover:underline"
                        >
                          {app.subdomain}.devtrust.ru
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  )
}