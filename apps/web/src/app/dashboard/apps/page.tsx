import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ExternalLink, Star, Sparkles, Package, Plus, Calendar, Check, ArrowRight, AppWindow, Zap } from "lucide-react"

export default async function DashboardAppsPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              subscriptions: {
                include: {
                  plan: { include: { app: true } },
                },
              },
            },
          },
        },
      },
    },
  }) as any

  const subscriptions = user?.memberships
    ?.flatMap((m: any) => m.organization?.subscriptions || [])
    || []

  const availableApps = await prisma.app.findMany({
    where: { status: "ACTIVE" },
    orderBy: { averageRating: "desc" },
    include: {
      category: true,
      plans: { take: 1, orderBy: { price: "asc" } },
    },
  })

  const myAppIds = new Set(subscriptions.map((sub: any) => sub.plan?.app?.id))
  const catalogApps = availableApps.filter((app) => !myAppIds.has(app.id))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <AppWindow className="w-4 h-4" />
                  Управление подписками
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Мои приложения
                </h1>
                <p className="text-lg text-slate-600">Управляйте своими подписками и находите новые инструменты</p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Добавить приложение
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* My Apps */}
            {subscriptions.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((sub: any) => {
                  const app = sub.plan?.app
                  const daysLeft = sub.currentPeriodEnd
                    ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null
                  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
                  const isExpired = daysLeft !== null && daysLeft < 0

                  return (
                    <div
                      key={sub.id}
                      className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-orange-200 transition-all flex-shrink-0">
                          {app?.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="w-8 h-8" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-red-200 to-orange-200 rounded-lg flex items-center justify-center">
                              <AppWindow className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                            {app?.name}
                          </h3>
                          <p className="text-sm text-slate-500">{sub.plan?.name}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {app?.category && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Package className="w-4 h-4" />
                            {app.category.name}
                          </div>
                        )}
                        {daysLeft !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {isExpired ? (
                              <span className="text-red-600 font-medium">Истекла</span>
                            ) : isExpiringSoon ? (
                              <span className="text-orange-600 font-medium">Истекает через {daysLeft} дн.</span>
                            ) : (
                              <span className="text-slate-500">До {sub.currentPeriodEnd?.toLocaleDateString("ru")}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-slate-500">Активна</span>
                        </div>
                      </div>

                      <Link
                        href={`/apps/${app?.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
                      >
                        Открыть приложение
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  У вас пока нет приложений
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                  Выберите приложения из каталога и начните работу прямо сейчас
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Открыть каталог
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Catalog Preview */}
            {catalogApps.length > 0 && (
              <>
                <div className="flex items-center justify-between mt-16 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-violet-500 rounded-full text-sm font-medium mb-3 shadow-sm">
                      <Zap className="w-4 h-4" />
                      Популярные приложения
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Добавьте новые инструменты</h2>
                    <p className="text-slate-500 mt-2">Расширьте возможности вашего бизнеса</p>
                  </div>
                  <Link
                    href="/catalog"
                    className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    Весь каталог
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catalogApps.slice(0, 8).map((app) => (
                    <Link
                      key={app.id}
                      href={`/apps/${app.slug}`}
                      className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:from-violet-200 group-hover:to-purple-200 transition-all">
                        {app.iconUrl ? (
                          <img src={app.iconUrl} alt={app.name} className="w-8 h-8" />
                        ) : (
                          <Sparkles className="w-7 h-7 text-violet-500" />
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors mb-2">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                        {app.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/30">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {app.averageRating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        <span className={`text-sm font-semibold ${app.isFree ? "text-green-600" : "text-violet-600"}`}>
                          {app.isFree ? "Бесплатно" : `от ${app.plans?.[0]?.price || 0} ₽`}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}