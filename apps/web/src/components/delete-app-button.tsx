"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteAppButton({ appId }: { appId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm("Удалить приложение? Это действие нельзя отменить.")
        if (!confirmed) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/apps/${appId}`, {
                method: "DELETE",
            })
            if (res.ok) {
                router.refresh()
            } else {
                alert("Ошибка при удалении")
            }
        } catch (error) {
            console.error(error)
            alert("Ошибка при удалении")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 
        rounded-lg transition-all disabled:opacity-50"
            title="Удалить"
        >
            <Trash2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
    )
}