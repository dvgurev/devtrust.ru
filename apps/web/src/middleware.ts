import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isAuthRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api")
  const isStaticRoute = pathname.startsWith("/_") || pathname.startsWith("/static")

  // Security headers для всех ответов
  const response = isStaticRoute || isApiRoute
    ? NextResponse.next()
    : await handleAuth(request, pathname, isAuthRoute)

  // Добавляем security headers ко всем ответам
  const securityHeaders = getSecurityHeaders(request)
  securityHeaders.forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

async function handleAuth(request: NextRequest, pathname: string, isAuthRoute: boolean) {
  if (pathname === "/robots.txt") {
    return new NextResponse(
      "User-Agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /admin\nDisallow: /api",
      { headers: { "Content-Type": "text/plain" } }
    )
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  if (isAuthRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

function getSecurityHeaders(request: NextRequest): [string, string][] {
  const isDev = process.env.NODE_ENV !== "production"
  const host = request.headers.get("host") || ""
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

  // Базовые security headers
  const headers: [string, string][] = [
    // Защита от XSS
    ["X-XSS-Protection", "1; mode=block"],
    // Защита от MIME-sniffing
    ["X-Content-Type-Options", "nosniff"],
    // Запрет фреймов (можно ослабить для внешних виджетов)
    ["X-Frame-Options", "DENY"],
    // Реферальная политика
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    // Permissions Policy
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  ]

  // CSP header
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://*.upstash.io",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]

  if (isDev || isLocalhost) {
    // В разработке разрешаем больше для удобства
    cspDirectives.push("connect-src 'self' https://api.stripe.com https://*.upstash.io http://localhost:* ws://localhost:*")
    cspDirectives.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
  }

  headers.push(["Content-Security-Policy", cspDirectives.join("; ")])

  // HSTS только в production
  if (!isDev && !isLocalhost) {
    headers.push(["Strict-Transport-Security", "max-age=31536000; includeSubDomains"])
  }

  return headers
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*", "/api/:path*"],
}