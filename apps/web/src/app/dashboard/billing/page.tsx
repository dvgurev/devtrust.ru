import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, Receipt, Check, Wallet, Plus, ArrowUpRight, Sparkles } from "lucide-react"

export default async function DashboardBillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Платежи и счета</h1>
          <p className="text-neutral-500 text-sm mt-1">Управляйте оплатой</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: "Потрачено", value: "0 ₽", icon: Wallet, color: "violet" },
          { label: "Подписок", value: 0, icon: CreditCard, color: "emerald" },
          { label: "Счетов", value: 0, icon: Receipt, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
            <stat.icon className="w-5 h-5 text-neutral-400 mb-2 lg:mb-3" />
            <div className="text-xl lg:text-3xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-xs lg:text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6 mb-4 lg:mb-6">
        <h2 className="font-bold text-neutral-900 text-sm lg:text-xl mb-4">Способы оплаты</h2>
        <div className="flex items-center justify-between p-3 lg:p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 lg:w-12 lg:h-8 bg-neutral-300 rounded-lg" />
            <div>
              <p className="font-bold text-neutral-900 text-sm">•••• 4242</p>
              <p className="text-xs text-neutral-500">12/28</p>
            </div>
          </div>
          <span className="text-xs lg:text-sm font-medium text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Основной
          </span>
        </div>
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed 
          border-neutral-200 text-neutral-500 rounded-2xl font-medium text-sm hover:border-neutral-300 transition-all">
          <Plus className="w-4 h-4" /> Добавить способ оплаты
        </button>
      </div>

      {/* Help */}
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
              <h3 className="font-bold text-violet-900 text-sm lg:text-xl">Помощь с оплатой?</h3>
            </div>
            <p className="text-violet-700 text-xs lg:text-sm">Свяжитесь с поддержкой</p>
          </div>
          <Link href="/docs/contact"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 
              bg-violet-600 text-white rounded-full font-bold text-sm hover:bg-violet-700 transition-all">
            Связаться <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}