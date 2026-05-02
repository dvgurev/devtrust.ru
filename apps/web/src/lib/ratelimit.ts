import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

// Создаем Redis клиент только если есть переменные окружения, иначе используем заглушку
let redisClient: any
try {
  redisClient = Redis.fromEnv()
} catch (error) {
  console.warn("Upstash Redis не сконфигурирован, используем заглушку для rate limiting")
  // Создаем объект-заглушку, который имитирует Redis клиент
  redisClient = {
    async pipeline() {
      return {
        sadd: () => {},
        expire: () => {},
        async exec() {
          return []
        }
      }
    },
    async smembers() {
      return []
    },
    async del() {
      return 0
    },
    async get() {
      return null
    },
    async set() {
      return "OK"
    },
    async incr() {
      return 1
    }
  }
}

const ratelimit = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  prefix: "ratelimit:",
})

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    )
  }

  return handler(request)
}

export const ratelimitAuth = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  prefix: "ratelimit:auth:",
})