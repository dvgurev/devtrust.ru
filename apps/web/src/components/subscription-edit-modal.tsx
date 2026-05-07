"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { X, Check, Zap, ArrowUpRight, Sparkles } from "lucide-react"

interface Plan {
    id: string
    name: string
    price: number
    slug: string
    features: string[] | null
}

interface SubscriptionEditModalProps {
    subscriptionId: string
    currentPlanId?: string
    targetPlanId?: string
    plans: Plan[]
}

export function SubscriptionEditModal({
    subscriptionId,
    currentPlanId,
    targetPlanId,
    plans
}: SubscriptionEditModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState(targetPlanId || "")
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null)

    const selectedPlan = plans.find(p => p.id === selectedPlanId)
    const isSamePlan = selectedPlanId === currentPlanId

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen])

    const handleSubmit = async () => {
        if (isSamePlan) {
            setIsOpen(false)
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/billing/change-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subscriptionId,
                    planId: selectedPlanId,
                    period: billingPeriod,
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                alert(error.error || "Ошибка при смене тарифа")
                return
            }

            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Ошибка при смене тарифа")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2.5 bg-violet-600 text-white rounded-full font-bold text-sm
          hover:bg-violet-700 transition-all duration-300 inline-flex items-center gap-2"
            >
                {targetPlanId ? "Перейти" : "Сменить тариф"}
                <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Content */}
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">
                                        {targetPlanId ? "Сменить тариф" : "Изменить тариф"}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-0.5">
                                        Выберите подходящий тарифный план
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full
                    text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                    transition-all duration-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Billing Period */}
                                <div className="mb-6">
                                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3">
                                        Период оплаты
                                    </p>
                                    <div className="flex bg-neutral-50 rounded-2xl p-1.5">
                                        <button
                                            onClick={() => setBillingPeriod("monthly")}
                                            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                        ${billingPeriod === "monthly"
                                                    ? "bg-white text-neutral-900 shadow-sm"
                                                    : "text-neutral-500 hover:text-neutral-700"
                                                }`}
                                        >
                                            Ежемесячно
                                        </button>
                                        <button
                                            onClick={() => setBillingPeriod("yearly")}
                                            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                        ${billingPeriod === "yearly"
                                                    ? "bg-white text-neutral-900 shadow-sm"
                                                    : "text-neutral-500 hover:text-neutral-700"
                                                }`}
                                        >
                                            За год (-20%)
                                        </button>
                                    </div>
                                </div>

                                {/* Plans */}
                                <div className="space-y-3">
                                    {plans.map((plan) => {
                                        const isSelected = selectedPlanId === plan.id
                                        const isCurrentPlan = plan.id === currentPlanId
                                        const price = billingPeriod === "yearly"
                                            ? Math.round(plan.price * 12 * 0.8)
                                            : plan.price
                                        const periodLabel = billingPeriod === "yearly" ? "/год" : "/мес"

                                        return (
                                            <button
                                                key={plan.id}
                                                onClick={() => setSelectedPlanId(plan.id)}
                                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300
                          ${isSelected
                                                        ? "border-violet-500 bg-violet-50/50"
                                                        : "border-neutral-100 hover:border-neutral-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${isSelected
                                                                ? "border-violet-500 bg-violet-500"
                                                                : "border-neutral-300"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-neutral-900">
                                                                {plan.name}
                                                                {isCurrentPlan && (
                                                                    <span className="ml-2 text-xs font-bold text-violet-600 
                                    bg-violet-100 px-2 py-0.5 rounded-full">
                                                                        Текущий
                                                                    </span>
                                                                )}
                                                            </p>
                                                            {plan.features && plan.features.length > 0 && (
                                                                <p className="text-xs text-neutral-500 mt-0.5">
                                                                    {plan.features.slice(0, 2).join(" · ")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black text-neutral-900">
                                                            {price > 0 ? `${price.toLocaleString("ru")} ₽` : "Бесплатно"}
                                                        </p>
                                                        {price > 0 && (
                                                            <p className="text-xs text-neutral-400">{periodLabel}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Features of Selected Plan */}
                                {selectedPlan?.features && selectedPlan.features.length > 0 && (
                                    <div className="mt-6 p-4 bg-neutral-50 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-violet-500" />
                                            <p className="text-sm font-bold text-neutral-700">
                                                Возможности тарифа «{selectedPlan.name}»
                                            </p>
                                        </div>
                                        <ul className="space-y-2">
                                            {selectedPlan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-neutral-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Warning for same plan */}
                                {isSamePlan && (
                                    <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-sm text-amber-700 font-medium">
                                            Вы уже используете этот тарифный план.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-neutral-100">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 px-5 py-3 border-2 border-neutral-200 text-neutral-700 
                      rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-all duration-300"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSamePlan || loading}
                                        className="flex-1 px-5 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-sm
                      hover:bg-neutral-800 transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white 
                          rounded-full animate-spin" />
                                                Сохранение...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" />
                                                {isSamePlan ? "Уже выбрано" : "Сменить тариф"}
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-neutral-400 text-center mt-3">
                                    Изменения вступят в силу с нового расчетного периода
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}