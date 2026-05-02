import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Star, MessageSquare, AppWindow, ArrowRight, Sparkles, Heart, Zap, TrendingUp } from "lucide-react"

type ReviewType = {
  id: string
  rating: number
  text: string
  createdAt: Date
  app: { id: string; name: string; slug: string }
  reply: { text: string } | null
}

export default async function DashboardReviewsPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    include: { app: true, reply: true },
    orderBy: { createdAt: "desc" },
  }) as ReviewType[]

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-rose-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-pink-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  Ваши отзывы
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Мои отзывы
                </h1>
                <p className="text-lg text-slate-600">Ваши отзывы о приложениях и ответы разработчиков</p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-pink-500/25 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Оставить новый отзыв
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-pink-50 text-pink-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{reviews.length}</div>
                  <div className="text-sm text-slate-500 mt-1">Отзывов оставлено</div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Средний рейтинг
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-slate-500 mt-1">Из 5 звёзд</div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Ответов
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">
                    {reviews.filter(r => r.reply).length}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Получено ответов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  У вас пока нет отзывов
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                  Оставьте отзыв о приложении и помогите другим пользователям сделать выбор
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-pink-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Выбрать приложения
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
                          <AppWindow className="w-7 h-7 text-pink-500" />
                        </div>
                        <div>
                          <Link
                            href={`/apps/${review.app.slug}`}
                            className="font-semibold text-slate-900 text-lg hover:text-pink-600 transition-colors"
                          >
                            {review.app.name}
                          </Link>
                          <p className="text-sm text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-lg mb-6">{review.text}</p>
                    {review.reply && (
                      <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border-l-4 border-blue-500 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Ответ разработчика</p>
                            <p className="text-sm text-slate-500">Команда {review.app.name}</p>
                          </div>
                        </div>
                        <p className="text-slate-700">{review.reply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Ваш голос важен!</h3>
                  </div>
                  <p className="text-pink-100 text-lg max-w-2xl">
                    Продолжайте делиться своим опытом использования приложений. Ваши отзывы помогают другим пользователям и разработчикам улучшать сервисы.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Оставить ещё отзыв
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}