import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Bell, CreditCard, Calendar, AlertCircle, CheckCircle, Info, ArrowRight, Zap, Settings, Sparkles } from "lucide-react"

type NotificationType = {
  id: string
  title: string
  text: string
  isRead: boolean
  createdAt: Date
  type?: string | null
}

function getNotificationIcon(type?: string | null) {
  switch (type) {
    case "payment":
      return <CreditCard className="w-5 h-5 text-blue-600" />
    case "subscription":
      return <Calendar className="w-5 h-5 text-green-600" />
    case "warning":
      return <AlertCircle className="w-5 h-5 text-orange-600" />
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    default:
      return <Info className="w-5 h-5 text-slate-600" />
  }
}

function getNotificationBg(type?: string | null) {
  switch (type) {
    case "payment":
      return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    case "subscription":
      return "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
    case "warning":
      return "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    case "success":
      return "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
    default:
      return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
  }
}

export default async function DashboardNotificationsPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const rawNotifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) as NotificationType[]

  const unreadCount = rawNotifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-purple-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-violet-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Bell className="w-4 h-4" />
                  Центр уведомлений
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Уведомления
                </h1>
                <p className="text-lg text-slate-600">
                  {unreadCount > 0 
                    ? `У вас ${unreadCount} непрочитанное${unreadCount === 1 ? '' : unreadCount < 5 ? 'ых' : 'ых'} уведомлений`
                    : "Все уведомления прочитаны"
                  }
                </p>
              </div>
              {unreadCount > 0 && (
                <form action="/api/notifications/mark-all-read" method="POST">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-400 to-purple-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-violet-500/25 transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Отметить все как прочитанные
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {rawNotifications.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-violet-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  У вас пока нет уведомлений
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                  Новые уведомления будут появляться здесь
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-400 to-purple-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-violet-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Открыть каталог
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                {rawNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`group p-6 ${index !== 0 ? 'border-t border-white/30' : ''} ${
                      !notification.isRead ? 'bg-gradient-to-r from-violet-50/50 to-purple-50/50' : ''
                    } hover:bg-white/30 transition-all`}
                  >
                    <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification.type)} border`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`font-semibold text-lg ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-slate-600 mb-3">{notification.text}</p>
                            <p className="text-sm text-slate-400">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ru })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {!notification.isRead && (
                              <form action={`/api/notifications/${notification.id}/mark-read`} method="POST">
                                <button
                                  type="submit"
                                  className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Прочитано
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Box */}
            {rawNotifications.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-xl">Уведомления по email</h3>
                    </div>
                    <p className="text-violet-100 text-lg max-w-2xl">
                      Вы также будете получать важные уведомления на ваш email. Убедитесь, что ваш email актуален и проверяйте папку "Спам".
                    </p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    Настройки профиля
                  </Link>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{rawNotifications.length}</div>
                    <div className="text-sm text-slate-500">Всего уведомлений</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{unreadCount}</div>
                    <div className="text-sm text-slate-500">Непрочитанных</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {rawNotifications.filter(n => n.type === "success").length}
                    </div>
                    <div className="text-sm text-slate-500">Успешных событий</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}