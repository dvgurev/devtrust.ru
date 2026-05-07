"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Check, Star, Calendar, Shield, Zap, Sparkles, ArrowUpRight, ShoppingBag } from "lucide-react"
import { useState } from "react"

type BillingPeriod = "monthly" | "yearly" | "oneTime"

interface PlanItem {
  id: string
  name: string
  price: number
  slug: string
  yearlyPrice: number | null
  oneTimePrice: number | null
  description: string | null
  features: unknown
}

interface App {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
  category: { name: string; slug: string } | null
  averageRating: number
  reviewsCount: number
}

interface BuyPageClientProps {
  app: App
  plans: PlanItem[]
  selectedPlan: PlanItem
  handleBuy: (period: string, price: number) => Promise<void>
}

export function BuyPageClient({ app, plans, selectedPlan, handleBuy }: BuyPageClientProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(selectedPlan.id)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [loading, setLoading] = useState(false)

  const currentPlan = plans.find(p => p.id === selectedPlanId) || selectedPlan

  const getPrice = (plan: PlanItem) => {
    if (billingPeriod === "yearly") return plan.yearlyPrice || plan.price * 12
    if (billingPeriod === "oneTime") return plan.oneTimePrice || plan.price * 24
    return plan.price
  }

  const getPeriodLabel = () => {
    if (billingPeriod === "yearly") return "/год"
    if (billingPeriod === "oneTime") return " разово"
    return "/мес"
  }

  const getSavings = () => {
    if (billingPeriod === "yearly" && currentPlan.yearlyPrice) {
      return currentPlan.price * 12 - currentPlan.yearlyPrice
    }
    return 0
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await handleBuy(billingPeriod, getPrice(currentPlan))
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Banner */}
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href={`/apps/${app.slug}`}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к приложению
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* App Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {app.iconUrl ? (
                <img src={app.iconUrl} alt={app.name} className="w-20 h-20 rounded-3xl object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-pink-400 
                  rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/20">
                  <span className="text-3xl font-black text-white">{app.name[0]}</span>
                </div>
              )}
            </motion.div>

            {/* App Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                {app.category && (
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
                    {app.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-neutral-400">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {app.averageRating.toFixed(1)} ({app.reviewsCount})
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                {app.name}
              </h1>
              <p className="text-neutral-400 text-lg max-w-xl">{app.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Billing Period */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-neutral-900">Период оплаты</h2>
          </div>

          <div className="flex bg-neutral-50 rounded-2xl p-1.5">
            {(["monthly", "yearly", "oneTime"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative
                  ${billingPeriod === period
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                  }`}
              >
                {period === "monthly" && "Ежемесячно"}
                {period === "yearly" && "За год"}
                {period === "oneTime" && "Навсегда"}
                {period === "yearly" && (
                  <span className="absolute -top-2 -right-1 px-2 py-0.5 bg-green-500 text-white 
                    text-[10px] font-bold rounded-full">-20%</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-neutral-900">Выберите тариф</h2>
          </div>

          <div className="space-y-3">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id
              const features = (plan.features as string[]) || []

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300
                    ${isSelected
                      ? "border-violet-500 bg-violet-50/50"
                      : "border-neutral-100 hover:border-neutral-200"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? "border-violet-500 bg-violet-500" : "border-neutral-300"}`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{plan.name}</p>
                        {features.length > 0 && (
                          <p className="text-sm text-neutral-500 mt-1">
                            {features.slice(0, 3).join(" · ")}
                            {features.length > 3 && ` + ещё ${features.length - 3}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-black text-neutral-900">
                        {getPrice(plan).toLocaleString()} ₽
                      </p>
                      <p className="text-sm text-neutral-400">{getPeriodLabel()}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Features */}
        {currentPlan.features && Array.isArray(currentPlan.features) &&
          (currentPlan.features as string[]).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h3 className="text-lg font-bold text-neutral-900">
                  Возможности тарифа «{currentPlan.name}»
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {(currentPlan.features as string[]).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-neutral-700 font-medium">{feature}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                  <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-sm text-neutral-700 font-medium">Техническая поддержка</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                  <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-sm text-neutral-700 font-medium">Ежемесячные обновления</span>
                </div>
              </div>
            </motion.div>
          )}

        {/* Compare Plans (if multiple) */}
        {plans.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6"
          >
            <h3 className="font-bold text-neutral-900 mb-4">Сравнение тарифов</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 text-sm font-medium text-neutral-400">Возможность</th>
                    {plans.map(p => (
                      <th key={p.id} className={`text-center py-3 text-sm font-bold 
                        ${selectedPlanId === p.id ? "text-violet-600" : "text-neutral-400"}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(plans.flatMap(p => (p.features as string[]) || [])))
                    .slice(0, 8)
                    .map((feature) => (
                      <tr key={feature} className="border-b border-neutral-50">
                        <td className="py-3 text-sm text-neutral-600">{feature}</td>
                        {plans.map(p => {
                          const feats = (p.features as string[]) || []
                          return (
                            <td key={p.id} className="text-center py-3">
                              {feats.includes(feature) ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-neutral-300">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-8 py-5 bg-neutral-900 text-white rounded-2xl font-bold text-lg
              hover:bg-neutral-800 hover:scale-[1.02] transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              shadow-2xl shadow-neutral-900/10 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Перенаправление...
              </>
            ) : (
              <>
                <span>Оплатить {getPrice(currentPlan).toLocaleString()} ₽{getPeriodLabel()}</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                {billingPeriod === "yearly" && getSavings() > 0 && (
                  <span className="text-sm font-normal text-green-400 ml-auto">
                    Экономия {getSavings().toLocaleString()} ₽/год
                  </span>
                )}
                {billingPeriod === "oneTime" && (
                  <span className="text-sm font-normal text-violet-400 ml-auto">
                    Пожизненный доступ
                  </span>
                )}
              </>
            )}
          </button>

          <p className="text-center text-sm text-neutral-400 mt-4">
            Оплата безопасна. Данные хранятся в РФ.
          </p>
        </motion.div>
      </div>
    </div>
  )
}