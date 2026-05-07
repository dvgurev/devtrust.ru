"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { X, AlertTriangle, XCircle } from "lucide-react"

interface CancelSubscriptionButtonProps {
    subscriptionId: string
    appName: string
}

export function CancelSubscriptionButton({
    subscriptionId,
    appName
}: CancelSubscriptionButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/billing/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId }),
            })

            if (!res.ok) {
                const error = await res.json()
                alert(error.error || "Ошибка при отмене подписки")
                return
            }

            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Ошибка при отмене подписки")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 
          border border-red-200 text-red-500 rounded-xl
          hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                title="Отменить подписку"
            >
                <XCircle className="w-4 h-4" />
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">
                                Отменить подписку?
                            </h3>
                            <p className="text-neutral-500 text-center mb-6">
                                Вы собираетесь отменить подписку на <strong>{appName}</strong>.
                                Подписка будет активна до конца оплаченного периода.
                            </p>

                            {/* Warning */}
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-6">
                                <p className="text-sm text-amber-700">
                                    После отмены вы потеряете доступ к приложению после окончания текущего периода.
                                    Все ваши данные будут сохранены в течение 30 дней.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-5 py-3 border-2 border-neutral-200 text-neutral-700 
                    rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-all duration-300"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 px-5 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm
                    hover:bg-red-700 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white 
                        rounded-full animate-spin" />
                                            Отмена...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            Отменить подписку
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}