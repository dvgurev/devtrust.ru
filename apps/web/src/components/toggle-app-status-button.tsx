"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ToggleAppStatusButton({
    appId,
    currentStatus
}: {
    appId: string
    currentStatus: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/apps/${appId}/toggle-status`, {
                method: "POST",
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const isActive = currentStatus === "ACTIVE"

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 
        rounded-lg transition-all disabled:opacity-50"
            title={isActive ? "Деактивировать" : "Активировать"}
        >
            {isActive ? (
                <XCircle className="w-4 h-4" />
            ) : (
                <CheckCircle className="w-4 h-4" />
            )}
        </button>
    )
}