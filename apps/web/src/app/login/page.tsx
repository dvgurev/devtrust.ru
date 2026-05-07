"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Sparkles, Mail, Lock, ArrowRight, Check } from "lucide-react"
import { Button, Input } from "@/components/ui/button"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

type LoginForm = z.infer<typeof loginSchema>

const benefits = [
  { text: "Безопасность данных" },
  { text: "Мгновенный доступ" },
  { text: "Командная работа" },
]

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="bg-bg">
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Вход в платформу DevTrust</div>
            <h1 className="font-display text-6xl md:text-[10rem] leading-tight tracking-[-0.04em] text-fg mb-4">
              Войдите в свой
              <br />
              бизнес-аккаунт
            </h1>
            <p className="text-muted font-mono text-sm max-w-2xl mx-auto">
              Получите доступ ко всем приложениям, документам и аналитике в одном месте
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-border p-8">
              {error && (
                <div className="mb-6 p-4 border-2 border-accent text-fg font-mono text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="Введите пароль"
                  />
                  {errors.password && (
                    <p className="mt-2 font-mono text-xs text-accent">{errors.password.message}</p>
                  )}
                </div>

                <div className="text-center">
                  <Link href="/forgot-password" className="font-mono text-xs text-fg hover:text-accent transition-colors">
                    Забыли пароль?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="accent"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? "Вход..." : "Войти в аккаунт"}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t-2 border-border text-center">
                <p className="font-mono text-sm text-muted">
                  Нет аккаунта?{" "}
                  <Link href="/register" className="text-fg hover:text-accent transition-colors">
                    Зарегистрироваться
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
      </section>
    </div>
  )
}
