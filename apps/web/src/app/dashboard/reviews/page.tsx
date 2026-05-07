// apps/web/src/app/dashboard/reviews/page.tsx
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
  if (!session?.user?.id) redirect("/login")

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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Мои отзывы</h1>
          <p className="text-neutral-500 text-sm mt-1">Ваши отзывы и ответы разработчиков</p>
        </div>
        <Link href="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-xs lg:text-sm hover:bg-neutral-800 transition-all">
          <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Оставить отзыв
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: "Отзывов", value: reviews.length, icon: MessageSquare, color: "neutral" },
          { label: "Рейтинг", value: averageRating.toFixed(1), icon: Star, color: "amber" },
          { label: "Ответов", value: repliedCount, icon: Heart, color: "violet" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-3 lg:p-6">
            <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.color === "neutral" ? "text-neutral-400" : `text-${stat.color}-500`} mb-1.5 lg:mb-3`} />
            <div className="text-lg lg:text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-[10px] lg:text-xs text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 lg:py-16 bg-white rounded-2xl lg:rounded-3xl border border-neutral-100">
          <MessageSquare className="w-10 h-10 lg:w-12 lg:h-12 text-neutral-300 mx-auto mb-3 lg:mb-4" />
          <h3 className="text-lg lg:text-xl font-bold text-neutral-900 mb-2">Нет отзывов</h3>
          <p className="text-neutral-500 text-sm mb-6">Оставьте отзыв о приложении</p>
          <Link href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
            <Sparkles className="w-4 h-4" /> Выбрать приложения
          </Link>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
              <div className="flex items-start justify-between gap-3 mb-3 lg:mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AppWindow className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-500" />
                  </div>
                  <div>
                    <Link href={`/apps/${review.app.slug}`}
                      className="font-bold text-neutral-900 hover:text-violet-600 text-sm lg:text-base">
                      {review.app.name}
                    </Link>
                    <p className="text-xs lg:text-sm text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 lg:w-5 lg:h-5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>
              </div>

              <p className="text-sm lg:text-base text-neutral-600 leading-relaxed mb-3 lg:mb-5">{review.text}</p>

              {review.reply ? (
                <div className="bg-violet-50 rounded-xl lg:rounded-2xl p-3 lg:p-5 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-violet-200 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-violet-600" />
                    </div>
                    <p className="text-xs lg:text-sm font-bold text-violet-800">Ответ разработчика</p>
                  </div>
                  <p className="text-xs lg:text-sm text-violet-700">{review.reply.text}</p>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-full text-xs text-neutral-400">
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" /> Ожидает ответа
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {reviews.length > 0 && (
        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
                <h3 className="font-bold text-violet-900 text-sm lg:text-base">Ваш голос важен!</h3>
              </div>
              <p className="text-violet-700 text-xs lg:text-sm">Делитесь опытом использования приложений</p>
            </div>
            <Link href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 lg:px-5 lg:py-2.5 
                bg-violet-600 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-violet-700 transition-all flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Оставить ещё
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}