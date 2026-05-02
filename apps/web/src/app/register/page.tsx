"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Mail, Lock, User, ArrowRight, Check, Package, Wallet, Zap, Shield } from "lucide-react"
import { motion } from "motion/react"

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
  { icon: Package, title: "Все приложения в одном месте", description: "CRM, документы, аналитика — единый интерфейс", bg: "bg-red-50", text: "text-red-600" },
  { icon: Wallet, title: "Платите за использование", description: "Тарифы зависят от количества пользователей", bg: "bg-violet-50", text: "text-violet-600" },
  { icon: Zap, title: "Мгновенный старт", description: "Доступ сразу после регистрации", bg: "bg-amber-50", text: "text-amber-600" },
  { icon: Shield, title: "Данные в РФ", description: "Безопасность и соответствие стандартам", bg: "bg-emerald-50", text: "text-emerald-600" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
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

      const signInResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!signInResponse.ok) {
        router.push("/login")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Произошла ошибка. Попробуйте позже.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Background */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Начните использовать платформу сегодня
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4"
            >
              Создайте
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                бизнес-аккаунт
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
            >
              Получите доступ ко всем приложениям, документам и аналитике в одном месте
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Features */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`${feature.bg} p-6 rounded-2xl border border-white/30 backdrop-blur-sm`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${feature.text} bg-white/60`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Что вы получите после регистрации</h3>
                  <div className="space-y-3">
                    {[
                      "Доступ к каталогу бизнес-приложений",
                      "Бесплатные приложения для старта",
                      "Прозрачная оплата за пользователей",
                      "Поддержка 24/7",
                      "Безопасное хранение данных в РФ",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Registration Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 md:p-10 sticky top-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Создать аккаунт</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Имя
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Иван Петров"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Пароль
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          {...register("password")}
                          type="password"
                          placeholder="Минимум 8 символов"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Подтверждение пароля
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          {...register("confirmPassword")}
                          type="password"
                          placeholder="Повторите пароль"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Создание аккаунта...</span>
                      ) : (
                        <>
                          Создать аккаунт
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                      Уже есть аккаунт?{" "}
                      <Link href="/login" className="text-red-600 font-semibold hover:text-red-700">
                        Войти
                      </Link>
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-slate-500"
                  >
                    {["Мгновенный доступ", "Отмена в любое время", "Поддержка 24/7"].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}