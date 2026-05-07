// apps/web/src/app/admin/promo/[id]/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
    ArrowLeft, Save, Tag, Calendar, Percent, Users,
    Copy, Check, Trash2, Shield, ArrowUpRight, Clock
} from "lucide-react"

type PromoType = {
    id: string
    code: string
    discount: number
    expiresAt: Date | null
    maxUses: number | null
    usedCount: number
    isActive: boolean
    createdAt: Date
}

async function getPromo(id: string) {
    return prisma.promoCode.findUnique({
        where: { id },
    }) as Promise<PromoType | null>
}

export default async function AdminEditPromoPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    if (session.user.role !== "ADMIN") redirect("/dashboard")

    const { id } = await params
    const promo = await getPromo(id)
    if (!promo) notFound()

    const promoId = promo.id

    async function updatePromo(formData: FormData) {
        "use server"
        const discount = parseInt(formData.get("discount") as string)
        const maxUses = formData.get("maxUses") as string
        const expiresAt = formData.get("expiresAt") as string
        const isActive = formData.get("isActive") === "on"

        if (!discount || discount < 1 || discount > 99) return

        await prisma.promoCode.update({
            where: { id: promoId },
            data: {
                discount,
                maxUses: maxUses ? parseInt(maxUses) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive,
            },
        })

        revalidatePath("/admin/promo")
        revalidatePath(`/admin/promo/${promoId}`)
        redirect("/admin/promo")
    }

    async function deletePromo(formData: FormData) {
        "use server"
        await prisma.promoCode.delete({ where: { id: promoId } })
        revalidatePath("/admin/promo")
        redirect("/admin/promo")
    }

    const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date()
    const isMaxedOut = promo.maxUses && promo.usedCount >= promo.maxUses
    const isActive = promo.isActive && !isExpired && !isMaxedOut

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/promo"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 
              rounded-xl transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                            Редактирование
                        </h1>
                        <p className="text-neutral-500 mt-1 font-mono tracking-wider">{promo.code}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        form="edit-form"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
                    >
                        <Save className="w-4 h-4" />
                        Сохранить и выйти
                    </button>
                </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Percent className="w-5 h-5 text-violet-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">{promo.discount}%</div>
                    <div className="text-sm text-neutral-400">Скидка</div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Users className="w-5 h-5 text-blue-500 mb-3" />
                    <div className="text-2xl font-black text-neutral-900">{promo.usedCount}</div>
                    <div className="text-sm text-neutral-400">
                        {promo.maxUses ? `Использовано / ${promo.maxUses}` : "Использовано"}
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <Calendar className="w-5 h-5 text-amber-500 mb-3" />
                    <div className="text-lg font-black text-neutral-900">
                        {promo.expiresAt
                            ? new Date(promo.expiresAt).toLocaleDateString("ru")
                            : "Бессрочно"}
                    </div>
                    <div className="text-sm text-neutral-400">
                        {isExpired ? "Истёк" : "Истекает"}
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    {isActive ? (
                        <Check className="w-5 h-5 text-emerald-500 mb-3" />
                    ) : (
                        <Clock className="w-5 h-5 text-neutral-400 mb-3" />
                    )}
                    <div className="text-lg font-black text-neutral-900">
                        {isActive ? "Активен" : "Неактивен"}
                    </div>
                    <div className="text-sm text-neutral-400">Статус</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                        <h2 className="text-lg font-bold text-neutral-900 mb-6">
                            Редактирование промокода
                        </h2>

                        <form id="edit-form" action={updatePromo} className="space-y-5">
                            {/* Code (readonly) */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Код
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        value={promo.code}
                                        disabled
                                        className="w-full pl-11 pr-4 py-3 bg-neutral-100 border border-neutral-200 
                      rounded-2xl text-neutral-500 font-mono tracking-wider cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 mt-1.5">Код изменить нельзя</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Скидка (%) *
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        <input
                                            name="discount"
                                            type="number"
                                            required
                                            min={1}
                                            max={99}
                                            defaultValue={promo.discount}
                                            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                        text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                        transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Макс. использований
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        <input
                                            name="maxUses"
                                            type="number"
                                            defaultValue={promo.maxUses || ""}
                                            placeholder="Без ограничений"
                                            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                        text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                        transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Истекает
                                    </label>
                                    <input
                                        name="expiresAt"
                                        type="date"
                                        defaultValue={promo.expiresAt
                                            ? new Date(promo.expiresAt).toISOString().split("T")[0]
                                            : ""}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                      text-neutral-900
                      focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                      transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Статус
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            defaultChecked={promo.isActive}
                                            className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                                        />
                                        <span className="text-sm font-medium text-neutral-700">
                                            Промокод активен
                                        </span>
                                    </label>
                                </div>
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
                            Это действие нельзя отменить. Промокод будет удалён безвозвратно.
                        </p>
                        <form action={deletePromo}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 
                  text-red-600 rounded-full font-bold text-sm hover:bg-red-50 
                  transition-all duration-300"
                            >
                                <Trash2 className="w-4 h-4" />
                                Удалить промокод
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Code Card */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Промокод</h3>
                        <div className="bg-neutral-50 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-black text-neutral-900 font-mono tracking-wider">
                                {promo.code}
                            </p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(promo.code)
                                }}
                                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 
                  hover:text-violet-700 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Копировать
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Статистика</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Использовано</span>
                                <span className="font-bold text-neutral-900">{promo.usedCount}</span>
                            </div>
                            {promo.maxUses && (
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">Лимит</span>
                                    <span className="font-bold text-neutral-900">{promo.maxUses}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Скидка</span>
                                <span className="font-bold text-neutral-900">{promo.discount}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">Создан</span>
                                <span className="font-medium text-neutral-600">
                                    {new Date(promo.createdAt).toLocaleDateString("ru")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Действия</h3>
                        <div className="space-y-2">
                            <Link
                                href="/admin/promo"
                                className="flex items-center justify-between p-3 text-sm text-neutral-600 
                  hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                            >
                                Все промокоды
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/admin/promo#add-promo"
                                className="flex items-center justify-between p-3 text-sm text-neutral-600 
                  hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                            >
                                Новый промокод
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}