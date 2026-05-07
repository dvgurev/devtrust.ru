// apps/web/src/app/admin/apps/[id]/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft, Save, AppWindow, Star, Package, ArrowUpRight,
    Image, Globe, Shield, Calendar, Trash2, Sparkles, Zap
} from "lucide-react"

type CategoryType = { id: string; name: string; slug: string }

async function getApp(id: string) {
    return prisma.app.findUnique({
        where: { id },
        include: {
            category: true,
            plans: { orderBy: { price: "asc" } },
            screenshots: { orderBy: { sortOrder: "asc" } },
            changelogs: { orderBy: { releasedAt: "desc" } },
            reviews: {
                include: { user: true, reply: true },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    })
}

export default async function AdminEditAppPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    if (session.user.role !== "ADMIN") redirect("/dashboard")

    const { id } = await params
    const app = await getApp(id)
    if (!app) notFound()

    const categories = await prisma.appCategory.findMany() as CategoryType[]

    async function updateApp(formData: FormData) {
        "use server"
        const appId = formData.get("appId") as string
        const name = formData.get("name") as string
        const slug = formData.get("slug") as string
        const description = formData.get("description") as string
        const categoryId = formData.get("categoryId") as string
        const subdomain = formData.get("subdomain") as string
        const status = formData.get("status") as string
        const isFree = formData.get("isFree") === "on"
        const featured = formData.get("featured") === "on"

        await prisma.app.update({
            where: { id: appId },
            data: {
                name,
                slug,
                description: description || null,
                categoryId: categoryId || null,
                subdomain: subdomain || null,
                status: status as any,
                isFree,
                featured,
            },
        })
    }

    async function deleteApp(formData: FormData) {
        "use server"
        const appId = formData.get("appId") as string
        await prisma.app.delete({ where: { id: appId } })
        redirect("/admin/apps")
    }

    // Функция просмотра приложения
    async function viewApp() {
        "use server"
        redirect(`/apps/${app!.slug}`)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/apps"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 
              rounded-xl transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                            Редактирование
                        </h1>
                        <p className="text-neutral-500 mt-1">{app.name}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/apps/${app.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-neutral-200 
              text-neutral-700 rounded-full font-bold text-sm hover:bg-neutral-50 
              transition-all duration-300"
                    >
                        <ArrowUpRight className="w-4 h-4" />
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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Star className="w-5 h-5 text-amber-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">
                        {Number(app.averageRating).toFixed(1)}
                    </div>
                    <div className="text-sm text-neutral-400">Рейтинг</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Package className="w-5 h-5 text-violet-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">{app.plans.length}</div>
                    <div className="text-sm text-neutral-400">Тарифов</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Image className="w-5 h-5 text-blue-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">{app.screenshots.length}</div>
                    <div className="text-sm text-neutral-400">Скриншотов</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Calendar className="w-5 h-5 text-emerald-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">
                        {new Date(app.createdAt).toLocaleDateString("ru")}
                    </div>
                    <div className="text-sm text-neutral-400">Создано</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                        <h2 className="text-lg font-bold text-neutral-900 mb-6">Основная информация</h2>

                        <form id="edit-form" action={updateApp} className="space-y-5">
                            <input type="hidden" name="appId" value={app.id} />

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Название *
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={app.name}
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
                                        defaultValue={app.slug}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                      text-neutral-900 placeholder:text-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                      transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Описание
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    defaultValue={app.description || ""}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300 resize-none"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Категория
                                    </label>
                                    <select
                                        name="categoryId"
                                        defaultValue={app.categoryId || ""}
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
                                        defaultValue={app.status}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                      text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 
                      focus:border-violet-500 transition-all duration-300"
                                    >
                                        <option value="ACTIVE">Активно</option>
                                        <option value="DRAFT">Черновик</option>
                                        <option value="MAINTENANCE">Обслуживание</option>
                                        <option value="ARCHIVED">Архив</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    <Globe className="w-4 h-4 inline mr-1.5" />
                                    Поддомен
                                </label>
                                <input
                                    name="subdomain"
                                    defaultValue={app.subdomain || ""}
                                    placeholder="myapp"
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300"
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-6 p-4 bg-neutral-50 rounded-2xl">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        defaultChecked={app.isFree}
                                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm font-medium text-neutral-700">
                                        <Zap className="w-4 h-4 inline mr-1" />
                                        Бесплатное
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        defaultChecked={app.featured}
                                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm font-medium text-neutral-700">
                                        <Sparkles className="w-4 h-4 inline mr-1" />
                                        Featured
                                    </span>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Plans */}
                    <div className="mt-6 bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-neutral-900">Тарифы ({app.plans.length})</h2>
                            <Link
                                href={`/admin/apps/${app.id}/plans/new`}
                                className="text-sm font-bold text-violet-600 hover:text-violet-700 
                  flex items-center gap-1"
                            >
                                Добавить тариф
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {app.plans.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {app.plans.map((plan) => (
                                    <div key={plan.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-bold text-neutral-900">{plan.name}</p>
                                            <p className="text-sm text-neutral-500">{Number(plan.price).toLocaleString("ru")} ₽/мес</p>
                                        </div>
                                        <Link
                                            href={`/admin/apps/${app.id}/plans/${plan.id}`}
                                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                        >
                                            Редактировать
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                                <p className="text-neutral-500">Тарифы не добавлены</p>
                            </div>
                        )}
                    </div>

                    {/* Screenshots */}
                    <div className="mt-6 bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-neutral-900">
                                Скриншоты ({app.screenshots.length})
                            </h2>
                            <button className="text-sm font-bold text-violet-600 hover:text-violet-700 
                flex items-center gap-1">
                                Добавить
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        {app.screenshots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {app.screenshots.map((s) => (
                                    <div key={s.id} className="aspect-video bg-neutral-100 rounded-xl overflow-hidden">
                                        <img src={s.url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Image className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                                <p className="text-neutral-500">Скриншоты не добавлены</p>
                            </div>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-6 bg-white rounded-3xl border border-red-100 p-6 lg:p-8">
                        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Опасная зона
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4">
                            Это действие нельзя отменить. Приложение и все связанные данные будут удалены.
                        </p>
                        <form action={deleteApp}>
                            <input type="hidden" name="appId" value={app.id} />
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 
                  text-red-600 rounded-full font-bold text-sm hover:bg-red-50 
                  transition-all duration-300"
                            >
                                <Trash2 className="w-4 h-4" />
                                Удалить приложение
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* App Preview */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Превью</h3>
                        <div className="aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
                            {app.iconUrl ? (
                                <img src={app.iconUrl} alt={app.name} className="w-16 h-16 rounded-xl" />
                            ) : (
                                <AppWindow className="w-12 h-12 text-neutral-400" />
                            )}
                        </div>
                        <p className="font-bold text-neutral-900 text-center">{app.name}</p>
                        {app.category && (
                            <p className="text-sm text-neutral-500 text-center mt-1">{app.category.name}</p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            {app.featured && (
                                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                                    Featured
                                </span>
                            )}
                            {app.isFree && (
                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                                    Free
                                </span>
                            )}
                        </div>
                        <Link
                            href={`/apps/${app.slug}`}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 
                bg-neutral-900 text-white rounded-xl font-medium text-sm
                hover:bg-neutral-800 transition-all duration-300"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Открыть страницу
                        </Link>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">
                            Отзывы ({app.reviews.length})
                        </h3>
                        {app.reviews.length > 0 ? (
                            <div className="space-y-3">
                                {app.reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="pb-3 border-b border-neutral-50 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-1 mb-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-neutral-500 line-clamp-2">
                                            {review.text || "Без текста"}
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {review.user?.name || "Аноним"} ·{" "}
                                            {new Date(review.createdAt).toLocaleDateString("ru")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 text-center py-4">Нет отзывов</p>
                        )}
                        <Link
                            href="/admin/reviews"
                            className="mt-3 block text-center text-sm font-medium text-violet-600 hover:text-violet-700"
                        >
                            Все отзывы
                        </Link>
                    </div>

                    {/* Date Info */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Информация</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Создано</span>
                                <span className="font-medium text-neutral-900">
                                    {new Date(app.createdAt).toLocaleDateString("ru")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Обновлено</span>
                                <span className="font-medium text-neutral-900">
                                    {new Date(app.updatedAt).toLocaleDateString("ru")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">ID</span>
                                <span className="font-mono text-xs text-neutral-400 truncate max-w-[120px]">
                                    {app.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}