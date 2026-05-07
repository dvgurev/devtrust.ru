// apps/web/src/app/dashboard/notifications/page.tsx
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
    case "payment": return <CreditCard className="w-4 h-4 lg:w-5 lg:h-5" />
    case "subscription": return <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
    case "warning": return <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
    case "success": return <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
    default: return <Info className="w-4 h-4 lg:w-5 lg:h-5" />
  }
}

export default async function DashboardNotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const rawNotifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) as NotificationType[]

  const unreadCount = rawNotifications.filter(n => !n.isRead).length
  const successCount = rawNotifications.filter(n => n.type === "success").length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Уведомления</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {unreadCount > 0 ? `У вас ${unreadCount} непрочитанных` : "Всё прочитано"}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action="/api/notifications/mark-all-read" method="POST">
            <button type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 bg-neutral-900 text-white 
                rounded-full font-bold text-xs lg:text-sm hover:bg-neutral-800 transition-all">
              <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Прочитать все
            </button>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: "Всего", value: rawNotifications.length, icon: Bell, color: "neutral" },
          { label: "Новых", value: unreadCount, icon: AlertCircle, color: "violet" },
          { label: "Успешно", value: successCount, icon: CheckCircle, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-3 lg:p-6">
            <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-400 mb-1.5 lg:mb-3" />
            <div className="text-lg lg:text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-[10px] lg:text-xs text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      {rawNotifications.length === 0 ? (
        <div className="text-center py-12 lg:py-16 bg-white rounded-2xl lg:rounded-3xl border border-neutral-100">
          <Bell className="w-10 h-10 lg:w-12 lg:h-12 text-neutral-300 mx-auto mb-3 lg:mb-4" />
          <h3 className="text-lg lg:text-xl font-bold text-neutral-900 mb-2">Уведомлений пока нет</h3>
          <p className="text-neutral-500 text-sm mb-6">Новые уведомления появятся здесь</p>
          <Link href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
            <Sparkles className="w-4 h-4" /> Открыть каталог
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 overflow-hidden">
          {rawNotifications.map((notification, index) => (
            <div key={notification.id}
              className={`flex items-start gap-3 lg:gap-4 p-4 lg:p-6
                ${index !== 0 ? 'border-t border-neutral-100' : ''}
                ${!notification.isRead ? 'bg-violet-50/30' : ''}
                hover:bg-neutral-50 transition-colors duration-200`}>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`font-bold text-sm lg:text-base ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-600'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-violet-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs lg:text-sm text-neutral-500 mb-1.5">{notification.text}</p>
                    <p className="text-[10px] lg:text-xs text-neutral-400">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ru })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <form action={`/api/notifications/${notification.id}/mark-read`} method="POST">
                      <button type="submit"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] lg:text-xs font-medium 
                          text-violet-600 hover:text-violet-700 hover:bg-violet-50 
                          rounded-full transition-all flex-shrink-0">
                        <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> Прочитано
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Info */}
      {rawNotifications.length > 0 && (
        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
                <h3 className="font-bold text-violet-900 text-sm lg:text-base">Уведомления по email</h3>
              </div>
              <p className="text-violet-700 text-xs lg:text-sm">Проверьте актуальность адреса в настройках</p>
            </div>
            <Link href="/dashboard/profile"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 lg:px-5 lg:py-2.5 
                bg-violet-600 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-violet-700 transition-all flex-shrink-0">
              <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Настройки
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}