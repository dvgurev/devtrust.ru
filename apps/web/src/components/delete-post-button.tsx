"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeletePostButton({ postId }: { postId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Удалить статью? Это действие нельзя отменить.")) return
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" })
            if (res.ok) router.refresh()
        } catch (error) {
            console.error(error)
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
            <Trash2 className="w-4 h-4" />
        </button>
    )
}