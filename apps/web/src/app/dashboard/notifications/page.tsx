import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import {
  Bell, CreditCard, Calendar, AlertCircle, CheckCircle,
  Info, ArrowRight, Zap, Settings, Sparkles, Check
} from "lucide-react"

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
      return <CreditCard className="w-5 h-5" />
    case "subscription":
      return <Calendar className="w-5 h-5" />
    case "warning":
      return <AlertCircle className="w-5 h-5" />
    case "success":
      return <CheckCircle className="w-5 h-5" />
    default:
      return <Info className="w-5 h-5" />
  }
}

function getNotificationColor(type?: string | null) {
  switch (type) {
    case "payment": return "blue"
    case "subscription": return "violet"
    case "warning": return "amber"
    case "success": return "emerald"
    default: return "neutral"
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
  const successCount = rawNotifications.filter(n => n.type === "success").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Уведомления
          </h1>
          <p className="text-neutral-500 mt-1">
            {unreadCount > 0
              ? `У вас ${unreadCount} непрочитанных уведомлений`
              : "Все уведомления прочитаны"
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <form action="/api/notifications/mark-all-read" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
                rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4" />
              Прочитать все
            </button>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{rawNotifications.length}</div>
              <div className="text-xs text-neutral-400">Всего</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{unreadCount}</div>
              <div className="text-xs text-neutral-400">Непрочитанных</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">{successCount}</div>
              <div className="text-xs text-neutral-400">Успешных</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {rawNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            Уведомлений пока нет
          </h3>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Новые уведомления будут появляться здесь по мере использования платформы
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
              rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Открыть каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
          {rawNotifications.map((notification, index) => {
            const color = getNotificationColor(notification.type)
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 lg:p-6
                  ${index !== 0 ? 'border-t border-neutral-100' : ''}
                  ${!notification.isRead ? 'bg-violet-50/30' : ''}
                  hover:bg-neutral-50 transition-colors duration-200`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 bg-${color}-50 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">{notification.text}</p>
                      <p className="text-xs text-neutral-400">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ru })}
                      </p>
                    </div>

                    {/* Mark as read */}
                    {!notification.isRead && (
                      <form action={`/api/notifications/${notification.id}/mark-read`} method="POST">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium 
                            text-violet-600 hover:text-violet-700 hover:bg-violet-50 
                            rounded-full transition-all duration-200 flex-shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Прочитано
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Email Info */}
      {rawNotifications.length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-violet-500" />
                <h3 className="font-bold text-violet-900">Уведомления по email</h3>
              </div>
              <p className="text-violet-700 text-sm max-w-lg">
                Важные уведомления также отправляются на ваш email.
                Проверьте актуальность адреса в настройках профиля.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
                rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300
                flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
              Настройки профиля
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}