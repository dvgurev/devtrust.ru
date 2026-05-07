// apps/web/src/app/admin/posts/[id]/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
    ArrowLeft, Save, FileText, Calendar, Eye, Globe,
    Archive, Tag, ArrowUpRight, Clock, Trash2, Shield
} from "lucide-react"
import { CoverImageUpload } from "@/components/cover-image-upload"

type CategoryType = { id: string; name: string }

async function getPost(id: string) {
    return prisma.post.findUnique({
        where: { id },
        include: { category: true },
    })
}

export default async function AdminEditPostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    if (session.user.role !== "ADMIN") redirect("/dashboard")

    const { id } = await params
    const post = await getPost(id)
    if (!post) notFound()

    const postId = post.id
    const postPublishedAt = post.publishedAt

    const categories = await prisma.postCategory.findMany() as CategoryType[]

    async function updatePost(formData: FormData) {
        "use server"
        const title = formData.get("title") as string
        const slug = formData.get("slug") as string
        const content = formData.get("content") as string
        const excerpt = formData.get("excerpt") as string
        const categoryId = formData.get("categoryId") as string
        const status = formData.get("status") as string


        const data: any = {
            title,
            slug,
            content: content || "",
            excerpt: excerpt || null,
            categoryId: categoryId || null,
            status,

        }

        if (status === "PUBLISHED" && !postPublishedAt) {
            data.publishedAt = new Date()
        }

        await prisma.post.update({
            where: { id: postId },
            data,
        })

        revalidatePath("/admin/posts")
        revalidatePath(`/admin/posts/${postId}`)

         redirect("/admin/posts")
    }

    async function deletePost(formData: FormData) {
        "use server"
        await prisma.post.delete({ where: { id: postId } })
        revalidatePath("/admin/posts")
        redirect("/admin/posts")
    }

    const isPublished = post.status === "PUBLISHED"
    const coverImage = (post as any).coverImage || null

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/posts"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 
                          rounded-xl transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                            Редактирование
                        </h1>
                        <p className="text-neutral-500 mt-1 truncate max-w-md">{post.title}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-neutral-200 
                          text-neutral-700 rounded-full font-bold text-sm hover:bg-neutral-50 
                          transition-all duration-300"
                    >
                        <Eye className="w-4 h-4" />
                        Просмотр
                    </Link>
                    <button
                        type="submit"
                        form="edit-form"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
                          rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
                    >
                        <Save className="w-4 h-4" />
                        Сохранить
                    </button>
                </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    {isPublished ? (
                        <Globe className="w-5 h-5 text-emerald-500 mb-3" />
                    ) : (
                        <Archive className="w-5 h-5 text-amber-500 mb-3" />
                    )}
                    <div className="text-lg font-black text-neutral-900">
                        {isPublished ? "Опубликовано" : "Черновик"}
                    </div>
                    <div className="text-sm text-neutral-400">Статус</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Tag className="w-5 h-5 text-violet-500 mb-3" />
                    <div className="text-lg font-black text-neutral-900">
                        {post.category?.name || "—"}
                    </div>
                    <div className="text-sm text-neutral-400">Категория</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Clock className="w-5 h-5 text-amber-500 mb-3" />
                    <div className="text-lg font-black text-neutral-900">
                        {new Date(post.updatedAt).toLocaleDateString("ru")}
                    </div>
                    <div className="text-sm text-neutral-400">Обновлена</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                        <h2 className="text-lg font-bold text-neutral-900 mb-6">Редактирование статьи</h2>

                        <form id="edit-form" action={updatePost} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Заголовок *
                                    </label>
                                    <input
                                        name="title"
                                        required
                                        defaultValue={post.title}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                          text-neutral-900 placeholder:text-neutral-400
                                          focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                          transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        name="slug"
                                        required
                                        defaultValue={post.slug}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                          text-neutral-900 placeholder:text-neutral-400
                                          focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                          transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Обложка статьи
                                </label>
                                <CoverImageUpload
                                    postId={postId}
                                    currentCover={coverImage}
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Категория
                                    </label>
                                    <select
                                        name="categoryId"
                                        defaultValue={post.categoryId || ""}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                          text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 
                                          focus:border-violet-500 transition-all duration-300"
                                    >
                                        <option value="">Без категории</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Статус
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue={post.status}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                          text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 
                                          focus:border-violet-500 transition-all duration-300"
                                    >
                                        <option value="DRAFT">Черновик</option>
                                        <option value="PUBLISHED">Опубликовано</option>
                                        <option value="ARCHIVED">Архив</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Отрывок (excerpt)
                                </label>
                                <textarea
                                    name="excerpt"
                                    rows={2}
                                    defaultValue={post.excerpt || ""}
                                    placeholder="Краткое описание для превью..."
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                      text-neutral-900 placeholder:text-neutral-400
                                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                      transition-all duration-300 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Содержание *
                                </label>
                                <textarea
                                    name="content"
                                    rows={20}
                                    defaultValue={post.content || ""}
                                    placeholder="HTML-содержание статьи..."
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                                      text-neutral-900 placeholder:text-neutral-400 font-mono text-sm
                                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                      transition-all duration-300 resize-none"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-3xl border border-red-100 p-6 lg:p-8">
                        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Опасная зона
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4">
                            Это действие нельзя отменить. Статья будет удалена безвозвратно.
                        </p>
                        <form action={deletePost}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 
                                  text-red-600 rounded-full font-bold text-sm hover:bg-red-50 
                                  transition-all duration-300"
                            >
                                <Trash2 className="w-4 h-4" />
                                Удалить статью
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Preview */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Превью</h3>
                        {coverImage ? (
                            <div className="aspect-video bg-neutral-100 rounded-2xl overflow-hidden mb-4">
                                <img
                                    src={coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-neutral-50 rounded-2xl flex items-center justify-center mb-4">
                                <FileText className="w-12 h-12 text-neutral-300" />
                            </div>
                        )}
                        <p className="font-bold text-neutral-900 text-center text-sm line-clamp-2">
                            {post.title}
                        </p>
                        {post.category && (
                            <p className="text-xs text-neutral-500 text-center mt-1">
                                {post.category.name}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-xs text-neutral-400">
                                {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString("ru")
                                    : "Не опубликована"}
                            </span>
                        </div>
                        <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 
                              bg-neutral-900 text-white rounded-xl font-medium text-sm
                              hover:bg-neutral-800 transition-all duration-300"
                        >
                            <Eye className="w-4 h-4" />
                            Открыть на сайте
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Действия</h3>
                        <div className="space-y-2">
                            <Link
                                href="/admin/posts"
                                className="flex items-center justify-between p-3 text-sm text-neutral-600 
                                  hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                            >
                                Все статьи
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/admin/posts#add-post"
                                className="flex items-center justify-between p-3 text-sm text-neutral-600 
                                  hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                            >
                                Новая статья
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Информация</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Создана</span>
                                <span className="font-medium text-neutral-900">
                                    {new Date(post.createdAt).toLocaleDateString("ru")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Обновлена</span>
                                <span className="font-medium text-neutral-900">
                                    {new Date(post.updatedAt).toLocaleDateString("ru")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}