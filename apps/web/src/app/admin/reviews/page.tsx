import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Star, MessageSquare, Check, X, Clock, AppWindow, Search, Reply, Trash2, Filter, ArrowUpDown, Sparkles, Zap, ArrowRight, Shield, User, Calendar } from "lucide-react"

type ReviewType = {
  id: string
  rating: number
  text: string
  isPublished: boolean
  isModerated: boolean
  createdAt: Date
  app: { id: string; name: string; slug: string }
  user: { name: string | null; email: string }
  reply: { id: string; text: string } | null
}

export default async function AdminReviewsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "ADMIN"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  async function moderateReview(reviewId: string, publish: boolean) {
    "use server"
    await prisma.review.update({
      where: { id: reviewId },
      data: { isPublished: publish, isModerated: true },
    })
  }

  async function replyToReview(formData: FormData) {
    "use server"
    const reviewId = formData.get("reviewId") as string
    const text = formData.get("text") as string

    if (!reviewId || !text?.trim()) return

    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    })

    if (!existing) return

    if (existing.reply) {
      await prisma.reviewReply.update({
        where: { id: existing.reply.id },
        data: { text: text.trim() },
      })
    } else {
      await prisma.reviewReply.create({
        data: { reviewId, text: text.trim() },
      })
    }
  }

  async function deleteReply(reviewId: string) {
    "use server"
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    })
    if (review?.reply) {
      await prisma.reviewReply.delete({ where: { id: review.reply.id } })
    }
  }

  const pendingReviews = await prisma.review.findMany({
    where: { isModerated: false },
    include: { app: true, user: true, reply: true },
    orderBy: { createdAt: "desc" },
  }) as ReviewType[]

  const publishedReviews = await prisma.review.findMany({
    where: { isModerated: true },
    include: { app: true, user: true, reply: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) as ReviewType[]

  const allReviews = [...pendingReviews, ...publishedReviews]
  const approvedCount = publishedReviews.filter(r => r.isPublished).length
  const rejectedCount = publishedReviews.filter(r => !r.isPublished).length
  const totalRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : "0.0"

  const stats = [
    {
      label: "На модерации",
      value: pendingReviews.length,
      icon: Clock,
      color: "amber",
      description: "Ожидают проверки"
    },
    {
      label: "Опубликовано",
      value: approvedCount,
      icon: Check,
      color: "emerald",
      description: "Доступны в каталоге"
    },
    {
      label: "Отклонено",
      value: rejectedCount,
      icon: X,
      color: "red",
      description: "Скрыты от пользователей"
    },
    {
      label: "Средний рейтинг",
      value: totalRating,
      icon: Star,
      color: "blue",
      description: `Из ${allReviews.length} отзывов`
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-pink-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-rose-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  Контроль качества
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Модерация отзывов
                </h1>
                <p className="text-lg text-slate-600">Проверка и управление отзывами пользователей о приложениях</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/apps"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <AppWindow className="w-4 h-4" />
                  Приложения
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/25 transition-all"
                >
                  <Star className="w-5 h-5" />
                  Каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                const colorClasses: Record<string, string> = {
                  amber: "bg-amber-50 text-amber-600",
                  emerald: "bg-emerald-50 text-emerald-600",
                  red: "bg-red-50 text-red-600",
                  blue: "bg-blue-50 text-blue-600",
                }

                return (
                  <div
                    key={i}
                    className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${colorClasses[stat.color]} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                      <div className="text-xs text-slate-400 mt-2">{stat.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pending Reviews Section */}
      {pendingReviews.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Ожидают модерации
                    <span className="ml-3 text-lg font-normal text-amber-600">({pendingReviews.length})</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {pendingReviews.map((review: ReviewType) => (
                  <div
                    key={review.id}
                    className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {review.user.name || "Без имени"}
                            </h3>
                            <span className="text-sm text-slate-500">{review.user.email}</span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <AppWindow className="w-4 h-4 text-slate-400" />
                              <Link
                                href={`/apps/${review.app.slug}`}
                                className="font-medium text-rose-600 hover:text-rose-700"
                              >
                                {review.app.name}
                              </Link>
                            </div>
                            <span className="text-sm text-slate-400">•</span>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.createdAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="bg-slate-50/80 rounded-2xl p-5 mb-4">
                            <p className="text-slate-700 leading-relaxed">{review.text}</p>
                          </div>

                          {review.reply && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-r-2xl p-5 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <p className="text-sm font-semibold text-blue-700">Ответ разработчика:</p>
                              </div>
                              <p className="text-sm text-blue-600">{review.reply.text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/30">
                      <form action={moderateReview.bind(null, review.id, true)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Опубликовать
                        </button>
                      </form>
                      <form action={moderateReview.bind(null, review.id, false)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
                        >
                          <X className="w-4 h-4" />
                          Отклонить
                        </button>
                      </form>
                      <form action={replyToReview} className="flex-1 min-w-[300px]">
                        <input type="hidden" name="reviewId" value={review.id} />
                        <div className="flex gap-2">
                          <input
                            name="text"
                            placeholder="Напишите ответ на отзыв..."
                            className="flex-1 px-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                          >
                            <Reply className="w-4 h-4" />
                            Ответить
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Reviews Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Поиск по тексту, приложению или пользователю..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 text-rose-700 text-sm font-medium rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Статус
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Сортировка
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {publishedReviews.length > 0 ? (
                publishedReviews.map((review: ReviewType) => (
                  <div
                    key={review.id}
                    className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {review.user.name || "Без имени"}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              review.isPublished
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                review.isPublished ? "bg-emerald-500" : "bg-red-500"
                              }`}></span>
                              {review.isPublished ? "Опубликован" : "Отклонён"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <AppWindow className="w-4 h-4 text-slate-400" />
                              <Link
                                href={`/apps/${review.app.slug}`}
                                className="font-medium text-rose-600 hover:text-rose-700"
                              >
                                {review.app.name}
                              </Link>
                            </div>
                            <span className="text-sm text-slate-400">•</span>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.createdAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-5 mb-4">
                      <p className="text-slate-700 leading-relaxed">{review.text}</p>
                    </div>

                    {review.reply ? (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-r-2xl p-5 mb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <p className="text-sm font-semibold text-blue-700">Ответ разработчика:</p>
                            </div>
                            <p className="text-sm text-blue-600">{review.reply.text}</p>
                          </div>
                          <form action={deleteReply.bind(null, review.id)}>
                            <button
                              type="submit"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить ответ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <form action={replyToReview} className="mb-4">
                        <input type="hidden" name="reviewId" value={review.id} />
                        <div className="flex gap-2">
                          <input
                            name="text"
                            placeholder="Ответить на отзыв..."
                            className="flex-1 px-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                          >
                            <Reply className="w-4 h-4" />
                            Ответить
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))
              ) : publishedReviews.length === 0 && pendingReviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-rose-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Нет отзывов</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                    Отзывы пользователей появятся здесь после их публикации
                  </p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/25 transition-all"
                  >
                    <Star className="w-5 h-5" />
                    Перейти в каталог
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Правила модерации</h3>
                </div>
                <p className="text-rose-100 text-lg mb-6">
                  Проверяйте отзывы на соответствие правилам платформы перед публикацией. Отклоняйте спам и оскорбительный контент.
                </p>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                  Настройки модерации
                </Link>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <Star className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-900">Быстрые действия</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/apps"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                  >
                    <span>Управление приложениями</span>
                    <AppWindow className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                  >
                    <span>Пользователи</span>
                    <User className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                  >
                    <span>Аналитика отзывов</span>
                    <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
