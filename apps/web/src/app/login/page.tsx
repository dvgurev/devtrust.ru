// apps/web/src/app/login/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, LogIn } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Неверный email или пароль")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        const redirectUrl = searchParams.get("redirect") || "/dashboard"
        window.location.href = redirectUrl
      }
    } catch (e) {
      setError("Произошла ошибка. Попробуйте позже.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 no-underline">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tight">DevTrust</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight mb-3">
              Войдите в аккаунт
            </h1>
            <p className="text-neutral-500">
              Получите доступ к бизнес-приложениям
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 
                    hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-neutral-500">Запомнить меня</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-lg
                hover:bg-neutral-800 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white 
                    rounded-full animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Войти в аккаунт
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-500">
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="font-bold text-neutral-900 hover:text-violet-600 transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Background */}
      <div className="hidden lg:flex flex-1 bg-neutral-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
        <div className="relative text-center p-12">
          <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-8" />
          <h2 className="text-3xl font-black text-white mb-4">
            Добро пожаловать обратно!
          </h2>
          <p className="text-neutral-400 text-lg max-w-md">
            Войдите, чтобы продолжить управлять вашими бизнес-приложениями и командой.
          </p>
        </div>
      </div>
    </div>
  )
}