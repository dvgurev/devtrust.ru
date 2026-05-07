import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  CreditCard, Receipt, Download, Check, Clock, AlertCircle,
  ArrowUpRight, Wallet, Plus, Sparkles
} from "lucide-react"

export default async function DashboardBillingPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  // Заглушки данных — замените на реальные запросы
  const payments: any[] = []
  const invoices: any[] = []
  const totalSpent = 0
  const activeSubscriptionsCount = 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Платежи и счета
          </h1>
          <p className="text-neutral-500 mt-1">
            Управляйте оплатой и отслеживайте историю платежей
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Добавить приложение
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-violet-500" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
            {totalSpent.toLocaleString("ru")} ₽
          </div>
          <div className="text-sm font-medium text-neutral-400">
            Потрачено всего
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
            {activeSubscriptionsCount}
          </div>
          <div className="text-sm font-medium text-neutral-400">
            Активных подписок
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <Receipt className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
            {invoices.length}
          </div>
          <div className="text-sm font-medium text-neutral-400">
            Счетов
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-violet-500" />
          Способы оплаты
        </h2>

        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-neutral-300 rounded-lg" />
            <div>
              <p className="font-bold text-neutral-900">•••• 4242</p>
              <p className="text-sm text-neutral-500">Истекает 12/28</p>
            </div>
          </div>
          <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            Основной
          </span>
        </div>

        <button className="mt-4 inline-flex items-center gap-2 px-5 py-3 border-2 border-dashed 
          border-neutral-200 text-neutral-500 rounded-2xl font-medium text-sm
          hover:border-neutral-300 hover:text-neutral-700 transition-all duration-300 w-full justify-center">
          <Plus className="w-4 h-4" />
          Добавить способ оплаты
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-violet-500" />
          История платежей
        </h2>

        {payments.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {payments.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${payment.status === "completed" ? "bg-emerald-50" : "bg-amber-50"}`}>
                    {payment.status === "completed" ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{payment.description}</p>
                    <p className="text-sm text-neutral-500">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">{payment.amount} ₽</p>
                  <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                    <Download className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 font-medium">Нет истории платежей</p>
            <p className="text-sm text-neutral-400 mt-1">
              Здесь будет отображаться история ваших транзакций
            </p>
          </div>
        )}
      </div>

      {/* Need Help */}
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="font-bold text-violet-900">Нужна помощь с оплатой?</h3>
        </div>
        <p className="text-violet-700 mb-4 leading-relaxed">
          Если у вас возникли вопросы по оплате или вы хотите изменить тарифный план,
          свяжитесь с нашей поддержкой.
        </p>
        <Link
          href="/docs/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
            rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300"
        >
          Связаться с поддержкой
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}