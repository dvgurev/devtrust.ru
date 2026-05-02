import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"
import crypto from "crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const emailSchema = z.object({
  email: z.string().email(),
})

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "3600 s"),
  prefix: "ratelimit:forgot:",
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const { success: rateLimited } = await rateLimit.limit(ip)

  if (!rateLimited) {
    return NextResponse.json(
      { message: "Если email существует, ссылка для сброса будет отправлена" }
    )
  }

  try {
    const body = await request.json()
    const { email } = emailSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Если email существует, ссылка для сброса будет отправлена" }
      )
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires,
      },
    })

    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ 
      message: "Если email существует, ссылка для сброса будет отправлена" 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Ошибка при отправке email" },
      { status: 500 }
    )
  }
}