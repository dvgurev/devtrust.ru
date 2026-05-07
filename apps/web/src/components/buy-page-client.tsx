"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Check, Star, Calendar, Shield, Sparkles, ArrowUpRight, ShoppingBag } from "lucide-react"
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

function getFeatures(plan: PlanItem): string[] {
  const f = plan.features
  if (Array.isArray(f)) return f.filter((x): x is string => typeof x === "string")
  return []
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

  const allFeatures = Array.from(new Set(plans.flatMap(p => getFeatures(p)))).slice(0, 8)

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link href={`/apps/${app.slug}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" />Назад к приложению
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              {app.iconUrl ? (
                <img src={app.iconUrl} alt={app.name} className="w-20 h-20 rounded-3xl object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-pink-400 rounded-3xl flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{app.name[0]}</span>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-2">
                {app.category && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{app.category.name}</span>}
                <span className="flex items-center gap-1 text-sm text-neutral-400">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {app.averageRating.toFixed(1)} ({app.reviewsCount})
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">{app.name}</h1>
              <p className="text-neutral-400 text-lg max-w-xl">{app.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Billing Period */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-neutral-900">Период оплаты</h2>
          </div>
          <div className="flex bg-neutral-50 rounded-2xl p-1.5">
            {(["monthly", "yearly", "oneTime"] as const).map((period) => (
              <button key={period} onClick={() => setBillingPeriod(period)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative
                  ${billingPeriod === period ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                {period === "monthly" ? "Ежемесячно" : period === "yearly" ? "За год" : "Навсегда"}
                {period === "yearly" && <span className="absolute -top-2 -right-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">-20%</span>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-neutral-900">Выберите тариф</h2>
          </div>
          <div className="space-y-3">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id
              const features = getFeatures(plan)
              return (
                <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300
                    ${isSelected ? "border-violet-500 bg-violet-50/50" : "border-neutral-100 hover:border-neutral-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-violet-500 bg-violet-500" : "border-neutral-300"}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{plan.name}</p>
                        {features.length > 0 && (
                          <p className="text-sm text-neutral-500 mt-1">
                            {features.slice(0, 3).join(" · ")}{features.length > 3 && ` + ещё ${features.length - 3}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right"><p className="text-2xl font-black">{getPrice(plan).toLocaleString()} ₽</p><p className="text-sm text-neutral-400">{getPeriodLabel()}</p></div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full px-8 py-5 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Перенаправление...</>
              : <><span>Оплатить {getPrice(currentPlan).toLocaleString()} ₽{getPeriodLabel()}</span><ArrowUpRight className="w-5 h-5" /></>}
          </button>
          <p className="text-center text-sm text-neutral-400 mt-4">Оплата безопасна. Данные хранятся в РФ.</p>
        </motion.div>
      </div>
    </div>
  )
}