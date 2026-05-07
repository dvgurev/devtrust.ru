import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AppWindow, ExternalLink, Check, Clock, AlertCircle, ArrowUpRight, Package } from "lucide-react"

export default async function DashboardAppsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              subscriptions: {
                include: { plan: { include: { app: true } } },
              },
            },
          },
        },
      },
    },
  }) as any

  const subscriptions = user?.memberships?.flatMap((m: any) => m.organization?.subscriptions || []) || []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Мои приложения</h1>
          <p className="text-neutral-500 text-sm mt-1">Управляйте подписками</p>
        </div>
        <Link href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
          <Package className="w-4 h-4" /> Добавить <ArrowUpRight className="w-4 h-4 hidden sm:block" />
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <AppWindow className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет приложений</h3>
          <p className="text-neutral-500 mb-6">Подпишитесь на приложения из каталога</p>
          <Link href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
              rounded-full font-bold hover:bg-neutral-800 transition-all">
            Открыть каталог <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {subscriptions.map((sub: any) => {
            const app = sub.plan?.app
            const daysLeft = sub.currentPeriodEnd
              ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null
            const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
            const isExpired = daysLeft !== null && daysLeft < 0

            return (
              <div key={sub.id} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6
                hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-xl lg:rounded-2xl 
                    flex items-center justify-center flex-shrink-0">
                    <AppWindow className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-neutral-900 text-sm lg:text-base truncate">{app?.name}</h3>
                    <p className="text-xs lg:text-sm text-neutral-500">{sub.plan?.name}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {daysLeft !== null && (
                    <div className="flex items-center gap-1.5 text-xs lg:text-sm">
                      {isExpired ? (
                        <><AlertCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-red-600 font-medium">Истекла</span></>
                      ) : isExpiringSoon ? (
                        <><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-amber-600 font-medium">Через {daysLeft} дн.</span></>
                      ) : (
                        <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-neutral-500">Активна</span></>
                      )}
                    </div>
                  )}
                </div>

                <Link href={`/apps/${app?.slug}`}
                  className="inline-flex items-center gap-1.5 w-full justify-center px-4 py-2.5 
                    bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 transition-all">
                  Открыть <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}