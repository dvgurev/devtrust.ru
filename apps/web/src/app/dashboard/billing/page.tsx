import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, Download, FileText, ArrowRight, CheckCircle, XCircle, Clock, Wallet, TrendingUp, Shield, Zap } from "lucide-react"

export default async function DashboardBillingPage() {
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
              invoices: {
                orderBy: { createdAt: "desc" },
                include: {
                  subscription: {
                    include: {
                      plan: { include: { app: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }) as any

  const invoices = user?.memberships?.flatMap((m: any) => m.organization?.invoices || []) || []

  const statusIcon = (status: string) => {
    switch (status) {
      case "PAID": return <CheckCircle className="w-5 h-5 text-green-600" />
      case "FAILED": return <XCircle className="w-5 h-5 text-red-600" />
      case "PENDING": return <Clock className="w-5 h-5 text-amber-600" />
      default: return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case "PAID": return "Оплачен"
      case "FAILED": return "Ошибка"
      case "PENDING": return "Ожидание"
      case "VOID": return "Отменён"
      default: return status
    }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PAID: "bg-green-100 text-green-700",
      FAILED: "bg-red-100 text-red-700",
      PENDING: "bg-amber-100 text-amber-700",
      VOID: "bg-slate-100 text-slate-700",
    }
    return `px-3 py-1.5 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-700"}`
  }

  const formatAmount = (amount: number, currency: string) => {
    const formatted = (amount / 100).toLocaleString("ru-RU", { minimumFractionDigits: 2 })
    return `${formatted} ${currency}`
  }

  const totalPaid = invoices
    .filter((inv: any) => inv.status === "PAID")
    .reduce((sum: number, inv: any) => sum + inv.amount, 0)

  const pendingInvoices = invoices.filter((inv: any) => inv.status === "PENDING").length

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-teal-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-emerald-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Wallet className="w-4 h-4" />
                  Финансовый контроль
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  История платежей
                </h1>
                <p className="text-lg text-slate-600">Счета и платежи по подпискам</p>
              </div>
              <Link
                href="/dashboard/subscriptions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/25 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                Управление подписками
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{invoices.length}</div>
                  <div className="text-sm text-slate-500 mt-1">Всего счетов</div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Оплачено
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{formatAmount(totalPaid, "RUB")}</div>
                  <div className="text-sm text-slate-500 mt-1">Общая сумма оплат</div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Ожидание
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{pendingInvoices}</div>
                  <div className="text-sm text-slate-500 mt-1">Ожидающих платежей</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {invoices.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Платежей пока нет
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                  Здесь будут отображаться ваши счета после оплаты подписок
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/25 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Открыть каталог
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/30">
                        <th className="text-left px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Счёт</th>
                        <th className="text-left px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Приложение</th>
                        <th className="text-left px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                        <th className="text-left px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Сумма</th>
                        <th className="text-left px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                        <th className="text-right px-8 py-5 text-sm font-medium text-slate-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/30">
                      {invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="hover:bg-white/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg">
                                <CreditCard className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <span className="text-sm font-mono text-slate-900 font-medium">
                                  {invoice.stripeInvoiceId?.slice(-8) || "—"}
                                </span>
                                <p className="text-xs text-slate-500 mt-1">Счёт</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-medium text-slate-900">
                              {invoice.subscription?.plan?.app?.name || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {invoice.subscription?.plan?.name || ""}
                            </p>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-600">
                            {invoice.paidAt
                              ? new Date(invoice.paidAt).toLocaleDateString("ru")
                              : new Date(invoice.createdAt).toLocaleDateString("ru")}
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-lg font-bold text-slate-900">
                              {formatAmount(invoice.amount, invoice.currency || "RUB")}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              {statusIcon(invoice.status)}
                              <span className={statusBadge(invoice.status)}>
                                {statusLabel(invoice.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            {invoice.pdfUrl ? (
                              <a
                                href={invoice.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                PDF
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Support Card */}
            <div className="mt-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Вопросы по платежам?</h3>
                  </div>
                  <p className="text-emerald-100 text-lg max-w-2xl">
                    Если у вас есть вопросы по оплате, статусу счёта или нужна помощь с возвратом средств, наша поддержка всегда готова помочь.
                  </p>
                </div>
                <Link
                  href="/docs/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Связаться с поддержкой
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
