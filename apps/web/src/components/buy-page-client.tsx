"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Check, Star, Calendar, Shield, Zap } from "lucide-react"
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
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

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
      const monthlyTotal = currentPlan.price * 12
      return monthlyTotal - currentPlan.yearlyPrice
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
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={`/apps/${app.slug}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к приложению
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center gap-6">
            {app.iconUrl ? (
              <img src={app.iconUrl} alt={app.name} className="w-20 h-20 rounded-2xl" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{app.name[0]}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{app.name}</h1>
              <p className="text-slate-500 mb-2">{app.description}</p>
              <div className="flex items-center gap-3">
                {app.category && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {app.category.name}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-slate-900">{app.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({app.reviewsCount})</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Billing Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">Период подписки</h2>
          
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              За год
              {currentPlan.yearlyPrice && (
                <span className="block text-xs opacity-70">-20%</span>
              )}
            </button>
            <button
              onClick={() => setBillingPeriod("oneTime")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                billingPeriod === "oneTime"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Разово
              {currentPlan.oneTimePrice && (
                <span className="block text-xs opacity-70">Полная версия</span>
              )}
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-4">Выберите тариф</h2>
          
          <div className="space-y-3">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedPlanId === p.id
                    ? "border-red-400 bg-red-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlanId === p.id ? "border-red-400 bg-red-400" : "border-slate-300"
                    }`}>
                      {selectedPlanId === p.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      <p className="text-sm text-slate-500">
                        {billingPeriod === "monthly" && "Ежемесячная оплата"}
                        {billingPeriod === "yearly" && "Оплата за год"}
                        {billingPeriod === "oneTime" && "Единоразовая оплата"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{getPrice(p)} ₽</p>
                    <p className="text-sm text-slate-500">{getPeriodLabel()}</p>
                  </div>
                </div>
                {Boolean(p.features && Array.isArray(p.features) && (p.features as string[]).length > 0) && (
                  <div className="pl-9 space-y-1">
                    {(expandedPlan === p.id ? (p.features as string[]) : (p.features as string[]).slice(0, 3)).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {(p.features as string[]).length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedPlan(expandedPlan === p.id ? null : p.id)
                        }}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        {expandedPlan === p.id ? "Скрыть" : `+ ещё ${(p.features as string[]).length - 3} возможностей`}
                      </button>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Selected Plan Description */}
        {currentPlan.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6"
          >
            <h3 className="font-semibold text-slate-900 mb-4">{currentPlan.name}</h3>
            <p className="text-slate-600 mb-4">{currentPlan.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Boolean(currentPlan.features && Array.isArray(currentPlan.features)) && (currentPlan.features as string[]).map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm">Техническая поддержка</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm">Ежемесячные обновления</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compare Plans */}
        {plans.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Сравнение тарифов</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 text-sm font-medium text-slate-500">Возможность</th>
                    {plans.map(p => (
                      <th key={p.id} className={`text-center py-3 text-sm font-medium ${selectedPlanId === p.id ? "text-red-500" : "text-slate-500"}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allFeatures = new Set<string>()
                    plans.forEach(p => {
                      const feats = p.features as string[] | null
                      if (feats && Array.isArray(feats)) {
                        feats.forEach(f => allFeatures.add(f))
                      }
                    })
                    return Array.from(allFeatures).slice(0, 8).map((feature) => (
                      <tr key={feature} className="border-b border-slate-100">
                        <td className="py-3 text-sm text-slate-600">{feature}</td>
                        {plans.map(p => {
                          const feats = p.features as string[] | null
                          const hasFeature = feats && Array.isArray(feats) && feats.includes(feature)
                          return (
                            <td key={p.id} className="text-center py-3">
                              {hasFeature ? (
                                <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-200 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Перенаправление...
              </span>
            ) : (
              <>
                Купить за {getPrice(currentPlan)} ₽{getPeriodLabel()}
                {billingPeriod === "yearly" && getSavings() > 0 && (
                  <span className="block text-sm font-normal opacity-80">
                    Экономия {getSavings()} ₽ в год
                  </span>
                )}
                {billingPeriod === "oneTime" && (
                  <span className="block text-sm font-normal opacity-80">
                    Пожизненный доступ
                  </span>
                )}
              </>
            )}
          </button>
          <p className="text-center text-sm text-slate-500 mt-4">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </motion.div>
      </div>
    </div>
  )
}