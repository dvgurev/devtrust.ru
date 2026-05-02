import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import Link from "next/link"
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react"

interface Props {
  searchParams: Promise<{ app?: string; redirect?: string }>
}

export default async function SSOLoginPage({ searchParams }: Props) {
  const { app: appSlug, redirect: redirectUrl } = await searchParams
  const session = await auth()

  if (session?.user) {
    if (appSlug) {
      const app = await prisma.app.findUnique({
        where: { slug: appSlug, isExternal: true },
      })

      if (app) {
        const accessToken = randomBytes(32).toString("hex")
        const refreshToken = randomBytes(32).toString("hex")
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const membership = await prisma.membership.findFirst({
          where: { userId: session.user.id },
          orderBy: { createdAt: "asc" },
        })

        if (membership) {
          await prisma.sSOToken.create({
            data: {
              userId: session.user.id as string,
              organizationId: membership.organizationId,
              appId: app.id,
              accessToken,
              refreshToken,
              expiresAt,
            },
          })

          const returnUrl = redirectUrl
            ? `${redirectUrl}?token=${accessToken}`
            : (app.externalUrl
                ? `${app.externalUrl}?token=${accessToken}`
                : `https://${app.slug}.devtrust.ru?token=${accessToken}`)

          redirect(returnUrl)
        }
      }
    }

    redirect(redirectUrl || "/dashboard")
  }

  const callbackUrl = appSlug
    ? `/sso/login?app=${appSlug}&redirect=${encodeURIComponent(redirectUrl || "")}`
    : "/login"

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Вход в платформу</h1>
          {appSlug && (
            <p className="text-slate-600">
              Для доступа к приложению {appSlug}
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <p className="text-center text-slate-600 mb-6">
            Войдите в платформу для доступа к приложению
          </p>
          
          <Link
            href={callbackUrl}
            className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-center"
          >
            Войти
          </Link>
        </div>
        
        <p className="text-center mt-6 text-slate-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700">
            Регистрация
          </Link>
        </p>
      </div>
    </div>
  )
}