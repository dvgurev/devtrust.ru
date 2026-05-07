// apps/web/src/app/forgot-password/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, ArrowLeft, Sparkles, Send, CheckCircle } from "lucide-react"

const schema = z.object({
  email: z.string().email("Введите корректный email"),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error)
        return
      }

      setMessage(result.message)
    } catch {
      setError("Произошла ошибка")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12 no-underline">
          <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <span className="text-2xl font-black text-neutral-900 tracking-tight">DevTrust</span>
        </Link>

        <div className="bg-white rounded-3xl border border-neutral-100 p-8 lg:p-10">
          {/* Success State */}
          {message ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-black text-neutral-900 mb-3">
                Инструкции отправлены
              </h1>
              <p className="text-neutral-500 leading-relaxed mb-8">
                {message}
              </p>
              <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-neutral-500">
                  Если письмо не пришло, проверьте папку «Спам» или{" "}
                  <button
                    onClick={() => setMessage(null)}
                    className="text-violet-600 font-medium hover:text-violet-700"
                  >
                    попробуйте другой email
                  </button>
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white 
                  rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться к входу
              </Link>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-7 h-7 text-violet-500" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight mb-3">
                  Забыли пароль?
                </h1>
                <p className="text-neutral-500 text-sm">
                  Введите email, и мы отправим ссылку для восстановления
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl
                        text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                        transition-all duration-300"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-lg
                    hover:bg-neutral-800 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white 
                        rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Отправить ссылку
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 
                    hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться к входу
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}