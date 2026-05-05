// apps/web/src/middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем статику и API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Защищаем только /dashboard и /admin
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      // Пробуем разные варианты получения токена
      let token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // Выводим все куки для отладки
      const allCookies = request.cookies.getAll()
      console.log("All cookies:", allCookies.map(c => c.name))

      // Ищем сессионную куку
      const sessionCookie = allCookies.find(c =>
        c.name.includes("next-auth") ||
        c.name.includes("session")
      )

      if (sessionCookie) {
        console.log("Session cookie found:", sessionCookie.name)
        console.log("Cookie value length:", sessionCookie.value.length)
      } else {
        console.log("No session cookie found!")
      }

      console.log("Token check:", {
        pathname,
        hasToken: !!token,
        role: token?.role,
        secret: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING"
      })

      if (!token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}