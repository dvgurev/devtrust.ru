"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button, Input } from "@/components/ui/button"

const schema = z.object({
  password: z.string().min(8, "Пароль должен быть минимум 8 символов"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  
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
    
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      })

      const result = await response.json()
       
      if (!response.ok) {
        setError(result.error)
        return
      }
      
      router.push("/login?reset=1")
    } catch {
      setError("Произошла ошибка")
    }
  }

  if (!token) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-muted">Ссылка недействительна</p>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="border-2 border-border p-8">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3 text-center">Новый пароль</div>
          <h1 className="font-display text-4xl md:text-6xl mb-6 text-fg text-center">Установите новый пароль</h1>
          
          {error && (
            <div className="mb-4 p-4 border-2 border-accent text-fg font-mono text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted mb-2 block">
                Новый пароль
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
                Подтвердите пароль
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
              disabled={isSubmitting}
              variant="accent"
              size="lg"
              className="w-full"
            >
              {isSubmitting ? "Сохранение..." : "Сохранить пароль"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="bg-bg min-h-screen flex items-center justify-center"><span className="font-mono text-sm text-muted">Загрузка...</span></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
