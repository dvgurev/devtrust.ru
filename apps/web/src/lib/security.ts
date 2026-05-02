import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function trackFailedAttempt(email: string): Promise<number> {
  const key = `failed_login:${email.toLowerCase()}`
  const attempts = await redis.incr(key)
  
  if (attempts === 1) {
    await redis.expire(key, 15 * 60)
  }
  
  return attempts
}

export async function clearFailedAttempts(email: string): Promise<void> {
  const key = `failed_login:${email.toLowerCase()}`
  await redis.del(key)
}

export async function getFailedAttempts(email: string): Promise<number> {
  const key = `failed_login:${email.toLowerCase()}`
  const attempts = await redis.get(key)
  return (attempts as number) || 0
}

export async function isAccountLocked(email: string): Promise<boolean> {
  const attempts = await getFailedAttempts(email)
  return attempts >= 5
}

export async function logSuspiciousActivity(
  event: "failed_login" | "many_failed_logins" | "suspicious_ip",
  details: { email?: string; ip?: string; userAgent?: string }
): Promise<void> {
  const log = {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  }
  console.warn("[SECURITY]", JSON.stringify(log))
}