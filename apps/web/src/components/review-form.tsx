"use client"

import { useState } from "react"
import { Star, AlertCircle, Send, Edit3, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

export function ReviewForm({ appId, existingReview, onCancel, onSuccess }: { appId: string; existingReview?: { id: string; rating: number; text: string | null }; onCancel?: () => void; onSuccess?: () => void }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [rating, setRating] = useState(existingReview?.rating || 5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState(existingReview?.text || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isEditing = !!existingReview
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  const ratingLabels = ["", "Плохо", "Ниже среднего", "Средне", "Хорошо", "Отлично"]

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900 mb-2">Войдите, чтобы оставить отзыв</p>
            <p className="text-sm text-amber-700 mb-4">
              Отзывы могут оставлять только авторизованные пользователи с доступом к приложению
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-orange-400 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:border-red-300 transition-all"
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (rating < 1 || rating > 5) {
      setError("Выберите оценку от 1 до 5 звёзд")
      setLoading(false)
      return
    }

    if (!text.trim()) {
      setError("Напишите текст отзыва")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/reviews", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, rating, text, reviewId: existingReview?.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setText("")
      setRating(5)
      router.refresh()
      if (onSuccess) onSuccess()
    } catch {
      setError("Ошибка при отправке отзыва")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center">
          {isEditing ? <Edit3 className="w-5 h-5 text-white" /> : <Send className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{isEditing ? "Редактировать отзыв" : "Оставить отзыв"}</h3>
          <p className="text-sm text-slate-500">Поделитесь своим мнением о приложении</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Ваша оценка</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 transition-transform"
                aria-label={`${star} звезда`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  }`}
                />
              </motion.button>
            ))}
            <motion.span
              key={rating}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-3 px-3 py-1 bg-gradient-to-r from-red-400 to-orange-400 text-white text-sm font-medium rounded-full"
            >
              {ratingLabels[rating]}
            </motion.span>
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Текст отзыва</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-400 focus:border-red-300 resize-none text-sm transition-all"
            rows={5}
            placeholder="Расскажите о вашем опыте использования приложения. Что понравилось, что можно улучшить..."
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-400">Минимум 10 символов</p>
            <p className={`text-xs ${text.length > 1900 ? 'text-red-500' : 'text-slate-400'}`}>
              {text.length}/2000
            </p>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-700">
                {isEditing ? "Отзыв обновлён!" : "Отзыв отправлен и появится после модерации"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? "Сохранение..." : "Отправка..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {isEditing ? "Сохранить" : "Отправить отзыв"}
              </>
            )}
          </motion.button>
          {isEditing && (
            <button
              type="button"
              onClick={() => { 
                setRating(5); 
                setText(""); 
                setSuccess(false);
                if (onCancel) onCancel();
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Отмена
            </button>
          )}
        </div>

        {!isEditing && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Star className="w-3 h-3" />
            Отзыв будет опубликован после модерации
          </p>
        )}
      </form>
    </motion.div>
  )
}