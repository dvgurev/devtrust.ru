"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/button"

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
  { title: "Все приложения в одном месте", description: "CRM, документы, аналитика — единый интерфейс" },
  { title: "Платите за использование", description: "Тарифы зависят от количества пользователей" },
  { title: "Мгновенный старт", description: "Доступ сразу после регистрации" },
  { title: "Данные в РФ", description: "Безопасность и соответствие стандартам" },
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
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Начните использовать платформу сегодня</div>
            <h1 className="font-display text-6xl md:text-[10rem] leading-tight tracking-[-0.04em] text-fg mb-4">
              Создайте
              <br />
              бизнес-аккаунт
            </h1>
            <p className="text-muted font-mono text-sm max-w-2xl mx-auto">
              Получите доступ ко всем приложениям, документам и аналитике в одном месте
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Features */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="border-2 border-border p-6">
                    <div className="font-display text-6xl leading-none text-muted mb-4">0{index + 1}</div>
                    <h3 className="font-display text-3xl md:text-4xl leading-tight mb-2 text-fg">{feature.title}</h3>
                    <p className="font-mono text-sm text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-2 border-border p-8">
                <h3 className="font-display text-3xl md:text-4xl mb-4 text-fg">Что вы получите после регистрации</h3>
                <div className="space-y-3">
                  {[
                    "Доступ к каталогу бизнес-приложений",
                    "Бесплатные приложения для старта",
                    "Прозрачная оплата за пользователей",
                    "Поддержка 24/7",
                    "Безопасное хранение данных в РФ",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-accent flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="text-fg font-mono text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="lg:col-span-1">
              <div className="border-2 border-border p-8 sticky top-8">
                {error && (
                  <div className="mb-6 p-4 border-2 border-accent text-fg font-mono text-sm">
                    {error}
                  </div>
                )}

                <h2 className="font-display text-4xl mb-6 text-fg">Создать аккаунт</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-muted mb-2 block">
                      Имя
                    </label>
                    <Input
                      {...register("name")}
                      type="text"
                      placeholder="Иван Петров"
                    />
                    {errors.name && (
                      <p className="mt-2 font-mono text-xs text-accent">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-muted mb-2 block">
                      Email
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 font-mono text-xs text-accent">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-muted mb-2 block">
                      Пароль
                    </label>
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Минимум 8 символов"
                    />
                    {errors.password && (
                      <p className="mt-2 font-mono text-xs text-accent">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-muted mb-2 block">
                      Подтверждение пароля
                    </label>
                    <Input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="Повторите пароль"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 font-mono text-xs text-accent">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="accent"
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? "Создание аккаунта..." : "Создать аккаунт"}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t-2 border-border text-center">
                  <p className="font-mono text-sm text-muted">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="text-fg hover:text-accent transition-colors">
                      Войти
                    </Link>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 justify-center font-mono text-xs text-muted">
                  {["Мгновенный доступ", "Отмена в любое время", "Поддержка 24/7"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}