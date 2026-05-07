"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

export function PostImageUpload({ postId }: { postId: string }) {
    const router = useRouter()
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
        formData.append("postId", postId)

        try {
            const res = await fetch("/api/admin/posts/upload-image", {
                method: "POST",
                body: formData,
            })
            if (res.ok) {
                setFile(null)
                setPreview(null)
                if (fileRef.current) fileRef.current.value = ""
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert("Ошибка загрузки")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="post-image-input"
            />

            {preview && (
                <div className="relative mb-4">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                    <button
                        onClick={() => { setPreview(null); setFile(null) }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md
              hover:bg-neutral-100 transition-colors"
                    >
                        <X className="w-4 h-4 text-neutral-700" />
                    </button>
                </div>
            )}

            <div className="flex gap-3">
                <label
                    htmlFor="post-image-input"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
            border-2 border-dashed border-neutral-200 text-neutral-500 rounded-2xl 
            font-medium text-sm hover:border-violet-300 hover:text-violet-600 
            transition-all duration-300 cursor-pointer"
                >
                    <Upload className="w-4 h-4" />
                    Выбрать изображение
                </label>
                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-sm
              hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50"
                    >
                        {uploading ? "Загрузка..." : "Загрузить"}
                    </button>
                )}
            </div>
        </div>
    )
}