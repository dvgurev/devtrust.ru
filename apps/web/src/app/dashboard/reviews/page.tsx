import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Star, MessageSquare, AppWindow, ArrowRight, Sparkles, Heart, ArrowUpRight } from "lucide-react"

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

  const repliedCount = reviews.filter(r => r.reply).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Мои отзывы
          </h1>
          <p className="text-neutral-500 mt-1">
            Ваши отзывы о приложениях и ответы разработчиков
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4" />
          Оставить отзыв
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{reviews.length}</div>
              <div className="text-xs text-neutral-400">Всего отзывов</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{averageRating.toFixed(1)}</div>
              <div className="text-xs text-neutral-400">Средний рейтинг</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{repliedCount}</div>
              <div className="text-xs text-neutral-400">Ответов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            У вас пока нет отзывов
          </h3>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Оставьте отзыв о приложении и помогите другим пользователям сделать выбор
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
              rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Выбрать приложения
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8
                hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AppWindow className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div>
                    <Link
                      href={`/apps/${review.app.slug}`}
                      className="font-bold text-neutral-900 hover:text-violet-600 transition-colors"
                    >
                      {review.app.name}
                    </Link>
                    <p className="text-sm text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("ru", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <p className="text-neutral-600 leading-relaxed mb-5">{review.text}</p>

              {/* Reply */}
              {review.reply && (
                <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-violet-200 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <p className="text-sm font-bold text-violet-800">
                      Ответ разработчика
                    </p>
                  </div>
                  <p className="text-sm text-violet-700 leading-relaxed">
                    {review.reply.text}
                  </p>
                </div>
              )}

              {/* No reply badge */}
              {!review.reply && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 
                  rounded-full text-xs text-neutral-400">
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
                  Ожидает ответа
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {reviews.length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h3 className="font-bold text-violet-900">Ваш голос важен!</h3>
              </div>
              <p className="text-violet-700 text-sm max-w-lg">
                Делитесь опытом использования приложений. Ваши отзывы помогают другим пользователям.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
                rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300
                flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Оставить ещё отзыв
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}