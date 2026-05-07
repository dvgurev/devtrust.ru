"use client"

import { Globe, Archive } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function TogglePublishButton({
    postId,
    currentStatus
}: {
    postId: string
    currentStatus: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/posts/${postId}/toggle-publish`, {
                method: "POST",
            })
            if (res.ok) router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const isPublished = currentStatus === "PUBLISHED"

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-lg transition-all disabled:opacity-50 ${isPublished
                    ? "text-neutral-400 hover:text-amber-600 hover:bg-amber-50"
                    : "text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
            title={isPublished ? "Снять с публикации" : "Опубликовать"}
        >
            {isPublished ? <Archive className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
        </button>
    )
}