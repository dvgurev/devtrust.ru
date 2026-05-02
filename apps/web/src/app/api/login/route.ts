import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { trackFailedAttempt, clearFailedAttempts, isAccountLocked, logSuspiciousActivity } from "@/lib/security"
import { logAudit } from "@/lib/audit"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:login:",
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const userAgent = request.headers.get("user-agent") ?? "unknown"
  const { success: rateLimited } = await rateLimit.limit(ip)

  if (!rateLimited) {
    return NextResponse.json(
      { error: "Слишком много попыток входа. Попробуйте позже." },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    if (await isAccountLocked(validated.email)) {
      await logSuspiciousActivity("many_failed_logins", {
        email: validated.email,
        ip,
        userAgent,
      })
      return NextResponse.json(
        { error: "Аккаунт временно заблокирован. Попробуйте через 15 минут." },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(validated.password, user.password)

    if (!isValid) {
      const attempts = await trackFailedAttempt(validated.email)
      
      if (attempts >= 3) {
        await logSuspiciousActivity("many_failed_logins", {
          email: validated.email,
          ip,
          userAgent,
        })
      }
      
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    await clearFailedAttempts(validated.email)

    const signInResult = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    })

    if (signInResult?.error) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    await logAudit({
      userId: user?.id,
      action: "user.login",
      ip,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Ошибка при входе" },
      { status: 500 }
    )
  }
}