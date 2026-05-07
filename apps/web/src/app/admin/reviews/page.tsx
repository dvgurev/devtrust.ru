// apps/web/src/app/admin/reviews/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
  Star, MessageSquare, Check, X, Clock,
  User, Calendar, Shield, ArrowUpRight,
  Eye, EyeOff
} from "lucide-react"

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
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  async function moderateReview(reviewId: string, publish: boolean) {
    "use server"
    await prisma.review.update({
      where: { id: reviewId },
      data: { isPublished: publish, isModerated: true },
    })
    revalidatePath("/admin/reviews")
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
    revalidatePath("/admin/reviews")
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
    revalidatePath("/admin/reviews")
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

  const approvedCount = publishedReviews.filter(r => r.isPublished).length
  const rejectedCount = publishedReviews.filter(r => !r.isPublished).length

  const stats = [
    { label: "На модерации", value: pendingReviews.length, icon: Clock, color: "amber" },
    { label: "Опубликовано", value: approvedCount, icon: Check, color: "emerald" },
    { label: "Отклонено", value: rejectedCount, icon: X, color: "red" },
    { label: "Всего", value: pendingReviews.length + publishedReviews.length, icon: Star, color: "violet" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Модерация отзывов
          </h1>
          <p className="text-neutral-500 mt-1">
            Проверка и управление отзывами пользователей
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Star className="w-4 h-4" />
          Каталог
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-6">
            <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-3`} />
            <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Ожидают модерации ({pendingReviews.length})
            </h2>
          </div>

          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                {/* User & App */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900">
                        {review.user.name || "Без имени"}
                      </span>
                      <span className="text-sm text-neutral-400">{review.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Link href={`/apps/${review.app.slug}`} className="text-violet-600 hover:text-violet-700 font-medium">
                        {review.app.name}
                      </Link>
                      <span>·</span>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleDateString("ru")}
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
                  <p className="text-neutral-700 text-sm leading-relaxed">{review.text}</p>
                </div>

                {/* Admin Reply */}
                {review.reply && (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700">Ответ:</span>
                    </div>
                    <p className="text-sm text-blue-600">{review.reply.text}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-100">
                  <form action={moderateReview.bind(null, review.id, true)}>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white 
                      rounded-full font-bold text-sm hover:bg-emerald-700 transition-all">
                      <Check className="w-4 h-4" />
                      Опубликовать
                    </button>
                  </form>
                  <form action={moderateReview.bind(null, review.id, false)}>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white 
                      rounded-full font-bold text-sm hover:bg-red-700 transition-all">
                      <X className="w-4 h-4" />
                      Отклонить
                    </button>
                  </form>
                  {/* Reply form */}
                  <form action={replyToReview} className="flex gap-2 flex-1 min-w-[250px]">
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input
                      name="text"
                      placeholder="Ответить на отзыв..."
                      className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl
                        text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-2xl font-bold text-sm
                        hover:bg-neutral-800 transition-all"
                    >
                      Ответить
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published/Rejected Reviews */}
      {publishedReviews.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Обработанные отзывы ({publishedReviews.length})
          </h2>
          <div className="space-y-4">
            {publishedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900">
                        {review.user.name || "Без имени"}
                      </span>
                      {review.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 
                          rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Опубликован
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 
                          rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Отклонён
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Link href={`/apps/${review.app.slug}`} className="text-violet-600 hover:text-violet-700 font-medium">
                        {review.app.name}
                      </Link>
                      <span>·</span>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleDateString("ru")}
                    </div>
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
                  <p className="text-neutral-700 text-sm leading-relaxed">{review.text}</p>
                </div>

                {review.reply ? (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-700">Ответ:</span>
                        </div>
                        <p className="text-sm text-blue-600">{review.reply.text}</p>
                      </div>
                      <form action={deleteReply.bind(null, review.id)}>
                        <button className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 
                          rounded-lg transition-colors" title="Удалить ответ">
                          <X className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <form action={replyToReview} className="flex gap-2">
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input
                      name="text"
                      placeholder="Ответить на отзыв..."
                      className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl
                        text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-2xl font-bold text-sm
                        hover:bg-neutral-800 transition-all"
                    >
                      Ответить
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingReviews.length === 0 && publishedReviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет отзывов</h3>
          <p className="text-neutral-500">Отзывы появятся здесь после публикации</p>
        </div>
      )}
    </div>
  )
}