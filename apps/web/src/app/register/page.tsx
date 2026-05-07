// apps/web/src/app/register/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Mail, Lock, User, Check, Eye, EyeOff, UserPlus, ArrowRight, Shield, Zap, Globe, TrendingUp } from "lucide-react"
import { signIn } from "next-auth/react"

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Пароль должен быть минимум 8 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

const features = [
  { icon: Globe, title: "Все приложения", desc: "CRM, документы, аналитика — в одном месте" },
  { icon: TrendingUp, title: "Оплата за использование", desc: "Тарифы зависят от пользователей" },
  { icon: Zap, title: "Мгновенный старт", desc: "Доступ сразу после регистрации" },
  { icon: Shield, title: "Данные в РФ", desc: "Безопасность и стандарты" },
]

const benefits = [
  "Доступ к каталогу бизнес-приложений",
  "Бесплатные приложения для старта",
  "Прозрачная оплата за пользователей",
  "Поддержка 24/7",
  "Безопасное хранение данных в РФ",
]

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Ошибка при регистрации")
        setIsLoading(false)
        return
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard',
      })
    } catch {
      setError("Произошла ошибка. Попробуйте позже.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex min-h-screen">
        {/* Left - Form */}
        <div className="flex-1 flex items-center justify-center px-4 lg:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-10 no-underline">
              <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <span className="text-2xl font-black text-neutral-900 tracking-tight">DevTrust</span>
            </Link>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight mb-3">
                Создайте аккаунт
              </h1>
              <p className="text-neutral-500">
                Начните использовать бизнес-приложения прямо сейчас
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Имя</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Иван Петров"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl
                      text-neutral-900 placeholder:text-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                      transition-all duration-300"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
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
                <label className="block text-sm font-bold text-neutral-700 mb-2">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 8 символов"
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    {...register("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl
                      text-neutral-900 placeholder:text-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                      transition-all duration-300"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
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
                    Создание аккаунта...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Создать аккаунт
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 text-center">
              <p className="text-neutral-500">
                Уже есть аккаунт?{" "}
                <Link
                  href="/login"
                  className="font-bold text-neutral-900 hover:text-violet-600 transition-colors"
                >
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right - Info Panel */}
        <div className="hidden lg:flex flex-1 bg-neutral-900 items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
          <div className="relative p-16">
            <Sparkles className="w-12 h-12 text-violet-400 mb-8" />
            <h2 className="text-3xl font-black text-white mb-4">
              Начните использовать платформу сегодня
            </h2>
            <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
              Получите доступ ко всем приложениям, документам и аналитике в одном месте.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                  <feature.icon className="w-6 h-6 text-violet-400 mb-3" />
                  <h3 className="font-bold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-neutral-400 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Bottom link */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 
                  hover:text-violet-300 transition-colors"
              >
                Посмотреть каталог приложений
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}