// apps/web/src/components/delete-user-button.tsx
"use client"

import { Trash2, X, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function DeleteUserButton({
    userId,
    userName
}: {
    userId: string
    userName: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
            if (res.ok) {
                setShowConfirm(false)
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || "Ошибка при удалении")
            }
        } catch (error) {
            console.error(error)
            alert("Ошибка при удалении")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setShowConfirm(true)
                }}
                disabled={loading}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 
          rounded-lg transition-all disabled:opacity-50"
                title="Удалить"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Модальное окно подтверждения */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowConfirm(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
                        >
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 
                  hover:bg-neutral-100 rounded-full transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>

                            <h3 className="text-lg font-bold text-neutral-900 text-center mb-2">
                                Удалить пользователя?
                            </h3>
                            <p className="text-sm text-neutral-500 text-center mb-6">
                                Вы собираетесь удалить пользователя <strong>{userName}</strong>.
                                Это действие нельзя отменить.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border-2 border-neutral-200 text-neutral-700 
                    rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-all duration-200"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-2xl font-bold text-sm
                    hover:bg-red-700 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white 
                        rounded-full animate-spin" />
                                            Удаление...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Удалить
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