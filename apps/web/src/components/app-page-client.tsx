"use client"

import Link from "next/link"
import {
  Star, Download, ExternalLink, Check, Clock, Building2,
  ArrowRight, ArrowLeft, Filter, Zap, MessageSquare, Calendar,
  ChevronRight, Image, Shield, Globe, Sparkles, Heart, Share2,
  ArrowUpRight, ShoppingBag, Play
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
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
  createdAt: string
  updatedAt: string
  category: { name: string; slug: string } | null
  plans: { id: string; name: string; price: number; slug: string; features: unknown }[]
  screenshots: { id: string; url: string; sortOrder: number }[]
  changelogs: { id: string; version: string; description: string; releasedAt: string; isLatest: boolean }[]
  reviews: {
    id: string
    rating: number
    text: string | null
    createdAt: string
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ru")
}

export function AppPageClient({ app, userReview, distribution, totalReviews }: AppPageClientProps) {
  const { data: session, status } = useSession()
  const [reviewSort, setReviewSort] = useState("newest")
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [installing, setInstalling] = useState(false)
  const [appStatus, setAppStatus] = useState<{ installed: boolean; redirect: string | null }>({ installed: false, redirect: null })
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "changelog">("overview")

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
    if (status === "loading") return
    if (!session?.user) {
      window.location.href = `/login?redirect=/apps/${app.slug}`
      return
    }
    setInstalling(true)
    try {
      const res = await fetch(`/api/apps/${app.slug}/install`, { method: "POST" })
      const data = await res.json()
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

  const tabs = [
    { id: "overview" as const, label: "Обзор", icon: Globe },
    { id: "reviews" as const, label: `Отзывы (${totalReviews})`, icon: MessageSquare },
    { id: "changelog" as const, label: "Обновления", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Section */}
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-neutral-400 mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <ChevronRight className="w-4 h-4" />
            {app.category && (
              <>
                <Link href={`/catalog?category=${app.category.slug}`} className="hover:text-white transition-colors">
                  {app.category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-white">{app.name}</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* App Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-violet-400 to-pink-400 
                  rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-violet-500/20">
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} className="w-full h-full rounded-3xl object-cover" />
                  ) : (
                    <span className="text-3xl lg:text-4xl font-black text-white">{app.name[0]}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tight">{app.name}</h1>
                    {app.featured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 
                        bg-violet-500/20 text-violet-300 rounded-full text-sm font-bold">
                        <Zap className="w-4 h-4" /> Топ
                      </span>
                    )}
                    {app.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 
                        bg-amber-500/20 text-amber-300 rounded-full text-sm font-bold">
                        Обслуживание
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-neutral-400">
                    {app.category && (
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" /> {app.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-white">{app.averageRating.toFixed(1)}</span>
                      <span>({totalReviews})</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl">{app.description}</p>

              <div className="flex flex-wrap gap-3 mt-8">
                {app.isFree ? (
                  <button
                    onClick={handleInstallFree}
                    disabled={installing || status === "loading"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 
                      rounded-full font-bold hover:bg-neutral-100 transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {installing ? "Подключение..." : "Начать использовать"}
                  </button>
                ) : (
                  <Link
                    href={`/apps/${app.slug}/buy`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 
                      rounded-full font-bold hover:bg-neutral-100 transition-all duration-300"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Купить от {app.plans[0]?.price || 0} ₽/мес
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 
                  text-white rounded-full font-bold hover:border-neutral-500 transition-all duration-300">
                  <Heart className="w-4 h-4" /> В избранное
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 
                  text-white rounded-full font-bold hover:border-neutral-500 transition-all duration-300">
                  <Share2 className="w-4 h-4" /> Поделиться
                </button>
              </div>
            </motion.div>

            {/* Pricing Card */}
            {!app.isFree && app.plans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:w-96 bg-white rounded-3xl p-6 lg:p-8 text-neutral-900"
              >
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-5 h-5 text-violet-500" />
                  <h3 className="font-bold text-lg">Тарифы</h3>
                </div>
                <div className="space-y-3">
                  {app.plans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/apps/${app.slug}/buy?plan=${plan.slug}`}
                      className="block w-full text-left p-4 rounded-2xl border-2 border-neutral-100 
                        hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{plan.name}</p>
                          <p className="text-sm text-neutral-500">
                            {(plan.features as string[])?.[0] || `${plan.price} ₽/мес`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black">{plan.price} ₽</span>
                          <span className="text-sm text-neutral-400 block">/мес</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Shield className="w-4 h-4 text-green-500" /> Данные в РФ
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Clock className="w-4 h-4 text-green-500" /> Мгновенная активация
                  </div>
                </div>
              </motion.div>
            )}

            {/* Free App Card */}
            {app.isFree && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:w-96 bg-white rounded-3xl p-6 lg:p-8 text-neutral-900"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <h3 className="font-bold text-lg">
                    {appStatus.installed ? "Подключено" : "Бесплатно"}
                  </h3>
                </div>
                {appStatus.installed ? (
                  <>
                    <p className="text-neutral-500 mb-6">Приложение подключено и готово к работе!</p>
                    <a
                      href={appStatus.redirect || "#"}
                      className="block w-full py-4 bg-neutral-900 text-white rounded-2xl 
                        font-bold text-center hover:bg-neutral-800 transition-all"
                    >
                      Перейти в приложение
                      <ArrowUpRight className="w-4 h-4 inline ml-1.5" />
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-neutral-500 mb-6">Начните использовать прямо сейчас!</p>
                    <button
                      onClick={handleInstallFree}
                      disabled={installing}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl 
                        font-bold hover:bg-neutral-800 transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {installing ? "Подключение..." : "Начать использовать"}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="flex border-b border-neutral-200 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-300 relative
                ${activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-10">
                  {/* Screenshots */}
                  {app.screenshots.length > 0 ? (
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-4">Скриншоты</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {app.screenshots.map((s) => (
                          <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-100">
                            <img src={s.url} alt={app.name} className="w-full h-48 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
                      <Image className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Скриншоты пока не добавлены</p>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Описание</h3>
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                      <p className="text-neutral-600 leading-relaxed">{app.description}</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <h4 className="font-bold text-neutral-900 mb-4">Информация</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-500">Категория</span>
                        <span className="font-medium text-neutral-900 ml-auto">{app.category?.name || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-500">Обновлено</span>
                        <span className="font-medium text-neutral-900 ml-auto">{formatDate(app.updatedAt)}</span>
                      </div>
                      {app.subdomain && (
                        <div className="flex items-center gap-3 text-sm">
                          <Globe className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-500">Сайт</span>
                          <a
                            href={`https://${app.subdomain}.devtrust.ru`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-violet-600 hover:text-violet-700 ml-auto flex items-center gap-1"
                          >
                            {app.subdomain}.devtrust.ru
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 border border-violet-100">
                    <Sparkles className="w-8 h-8 text-violet-500 mb-3" />
                    <p className="text-sm font-medium text-violet-900">
                      Нужна помощь с выбором? Напишите нам, и мы поможем подобрать оптимальный тариф.
                    </p>
                    <Link
                      href="/docs/contact"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-violet-700 hover:text-violet-900"
                    >
                      Связаться <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-3xl border border-neutral-100 p-6 mb-6">
                    <h3 className="font-bold text-neutral-900 mb-4">
                      {userReview ? "Ваш отзыв" : "Оставить отзыв"}
                    </h3>
                    <ReviewForm appId={app.id} existingReview={userReview || undefined} />
                  </div>

                  {app.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {app.reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-3xl border border-neutral-100 p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-violet-600 font-bold">
                                {(review.user.name || review.user.email || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-neutral-900">
                                  {review.user.name || review.user.email?.split("@")[0] || "Аноним"}
                                </span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-neutral-400">{formatDate(review.createdAt)}</span>
                              </div>
                              <p className="text-neutral-600 mt-2">{review.text || "Без текста"}</p>
                              {review.reply && (
                                <div className="mt-4 pl-4 border-l-2 border-violet-200">
                                  <p className="text-sm font-bold text-violet-700 mb-1">Ответ разработчика</p>
                                  <p className="text-sm text-neutral-600">{review.reply.text}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100">
                      <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Пока нет отзывов. Будьте первым!</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="bg-white rounded-3xl border border-neutral-100 p-6 sticky top-24">
                    <h4 className="font-bold text-neutral-900 mb-4">Рейтинг</h4>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-5xl font-black text-neutral-900">{app.averageRating.toFixed(1)}</span>
                      <div>
                        <div className="flex mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(app.averageRating) ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-500">{totalReviews} отзывов</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {distribution.map((item) => (
                        <div key={item.rating} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-neutral-600 w-3">{item.rating}</span>
                          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: totalReviews > 0 ? `${(item.count / totalReviews) * 100}%` : '0%' }}
                            />
                          </div>
                          <span className="text-sm text-neutral-400 w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "changelog" && (
            <motion.div key="changelog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {app.changelogs.length > 0 ? (
                <div className="max-w-2xl">
                  <div className="relative pl-8 border-l-2 border-neutral-200 space-y-8">
                    {app.changelogs.map((log) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[25px] top-1 w-4 h-4 bg-neutral-900 rounded-full border-4 border-[#f5f5f5]" />
                        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-neutral-900">v{log.version}</span>
                            {log.isLatest && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                Текущая
                              </span>
                            )}
                            <span className="text-sm text-neutral-400">{formatDate(log.releasedAt)}</span>
                          </div>
                          <p className="text-neutral-600">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100">
                  <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">История версий пока пуста</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}