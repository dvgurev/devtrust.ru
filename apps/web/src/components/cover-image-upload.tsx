"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"

export function CoverImageUpload({
    postId,
    currentCover
}: {
    postId: string
    currentCover: string | null
}) {
    const router = useRouter()
    const [cover, setCover] = useState<string | null>(currentCover)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onload = (e) => setPreview(e.target?.result as string)
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                setCover(data.url)
                setPreview(null)
                setFile(null)
                if (fileRef.current) fileRef.current.value = ""

                // Автоматически сохраняем обложку в посте
                await fetch(`/api/admin/posts/${postId}/cover`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ coverImage: data.url }),
                })

                router.refresh()
            } else {
                alert("Ошибка загрузки")
            }
        } catch (error) {
            console.error(error)
            alert("Ошибка загрузки")
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = async () => {
        if (!confirm("Удалить обложку?")) return

        await fetch(`/api/admin/posts/${postId}/cover`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coverImage: "" }),
        })

        setCover(null)
        router.refresh()
    }

    return (
        <div className="space-y-3">
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="cover-image-input"
            />

            {/* Preview */}
            {(preview || cover) && (
                <div className="relative aspect-video bg-neutral-100 rounded-2xl overflow-hidden">
                    <img
                        src={preview || cover || ""}
                        alt="Обложка"
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => {
                            if (preview) {
                                setPreview(null)
                                setFile(null)
                            } else {
                                handleRemove()
                            }
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md
              hover:bg-neutral-100 transition-colors"
                    >
                        <X className="w-4 h-4 text-neutral-700" />
                    </button>
                </div>
            )}

            {/* No cover placeholder */}
            {!preview && !cover && (
                <div className="aspect-video bg-neutral-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-neutral-200">
                    <ImageIcon className="w-10 h-10 text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-400">Обложка не загружена</p>
                </div>
            )}

            {/* Upload button */}
            <div className="flex gap-3">
                <label
                    htmlFor="cover-image-input"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
            border-2 border-dashed border-neutral-200 text-neutral-500 rounded-2xl 
            font-medium text-sm hover:border-violet-300 hover:text-violet-600 
            transition-all duration-300 cursor-pointer"
                >
                    <Upload className="w-4 h-4" />
                    {cover ? "Заменить обложку" : "Загрузить обложку"}
                </label>
                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-sm
              hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50"
                    >
                        {uploading ? "Загрузка..." : "Сохранить"}
                    </button>
                )}
            </div>
        </div>
    )
}