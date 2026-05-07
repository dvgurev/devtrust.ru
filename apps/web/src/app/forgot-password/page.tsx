"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@/components/ui/button"

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
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="border-2 border-border p-8">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3 text-center">Восстановление пароля</div>
          <h1 className="font-display text-4xl md:text-6xl mb-6 text-fg text-center">Восстановление пароля</h1>
          
          {message && (
            <div className="mb-4 p-4 border-2 border-fg/20 text-fg font-mono text-sm">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 border-2 border-accent text-fg font-mono text-sm">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="accent"
              size="lg"
              className="w-full"
            >
              {isSubmitting ? "Отправка..." : "Отправить ссылку"}
            </Button>
          </form>

          <p className="mt-8 pt-8 border-t-2 border-border text-center">
            <Link href="/login" className="font-mono text-sm text-fg hover:text-accent transition-colors">
              Вернуться к входу
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
