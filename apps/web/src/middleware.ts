// apps/web/src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Если не авторизован — редирект на логин
  if (!session?.user) {
    // Редиректим только защищённые страницы
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Если админ-страница, но роль не ADMIN — редирект в дашборд
  if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Если уже авторизован и идёт на /login или /register — редирект в дашборд
  if (session.user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}