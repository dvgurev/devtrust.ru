import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

let rateLimit: any = null

async function initRateLimit() {
  if (rateLimit) return rateLimit
  
  try {
    const { Ratelimit } = await import("@upstash/ratelimit")
    const { Redis } = await import("@upstash/redis")
    
    const redis = Redis.fromEnv()
    await redis.ping()
    
    rateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "ratelimit:register:",
    })
    return rateLimit
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const rl = await initRateLimit()
  
  if (rl) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown"
    const { success: rateLimited } = await rl.limit(ip)
  
    if (!rateLimited) {
      return NextResponse.json(
        { error: "Слишком много попыток. Попробуйте позже." },
        { status: 429 }
      )
    }
  }

  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email уже используется" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    })

    const session = await auth()
    if (session) {
      // Sign in after registration - handled client-side
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 }
    )
  }
}