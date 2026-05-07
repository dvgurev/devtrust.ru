// apps/web/src/app/admin/promo/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
  Tag, Plus, Trash2, Edit, Copy, Check, X,
  Calendar, Sparkles, ArrowUpRight, Percent,
  Eye, EyeOff
} from "lucide-react"
import { DeletePromoButton } from "@/components/delete-promo-button"

type PromoType = {
  id: string
  code: string
  discount: number
  expiresAt: Date | null
  maxUses: number | null
  usedCount: number
  createdAt: Date
  isActive: boolean
}

export default async function AdminPromoPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  async function createPromo(formData: FormData) {
    "use server"
    const code = (formData.get("code") as string).toUpperCase().replace(/[^A-Z0-9]/g, "")
    const discount = parseInt(formData.get("discount") as string)
    const maxUses = formData.get("maxUses") as string
    const expiresAt = formData.get("expiresAt") as string

    if (!code || !discount || discount < 1 || discount > 99) return

    await prisma.promoCode.create({
      data: {
        code,
        discount,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    revalidatePath("/admin/promo")
  }

  async function togglePromo(promoId: string, currentActive: boolean) {
    "use server"
    await prisma.promoCode.update({
      where: { id: promoId },
      data: { isActive: !currentActive },
    })
    revalidatePath("/admin/promo")
  }

  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  }) as PromoType[]

  const activePromos = promos.filter(p => {
    if (!p.isActive) return false
    if (p.expiresAt && new Date(p.expiresAt) < new Date()) return false
    if (p.maxUses && p.usedCount >= p.maxUses) return false
    return true
  })

  const stats = {
    total: promos.length,
    active: activePromos.length,
    totalUsed: promos.reduce((sum, p) => sum + p.usedCount, 0),
    avgDiscount: promos.length > 0
      ? Math.round(promos.reduce((sum, p) => sum + p.discount, 0) / promos.length)
      : 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Промокоды
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление скидочными промокодами
          </p>
        </div>
        <a
          href="#add-promo"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Создать промокод
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего", value: stats.total, icon: Tag, color: "neutral" },
          { label: "Активных", value: stats.active, icon: Check, color: "emerald" },
          { label: "Использовано", value: stats.totalUsed, icon: Percent, color: "violet" },
          { label: "Средняя скидка", value: `${stats.avgDiscount}%`, icon: Sparkles, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-6">
            <stat.icon className={`w-5 h-5 ${stat.color === "neutral" ? "text-neutral-400" : `text-${stat.color}-500`
              } mb-3`} />
            <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Промокод
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Скидка
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Использовано
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Статус
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Истекает
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {promos.map((promo) => {
                const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date()
                const isMaxedOut = promo.maxUses && promo.usedCount >= promo.maxUses
                const isActive = promo.isActive && !isExpired && !isMaxedOut

                return (
                  <tr key={promo.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                          ${isActive ? "bg-emerald-50" : "bg-neutral-100"}`}>
                          <Tag className={`w-5 h-5 ${isActive ? "text-emerald-500" : "text-neutral-400"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 font-mono tracking-wider">
                            {promo.code}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {promo.maxUses ? `До ${promo.maxUses} исп.` : "Без ограничений"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="inline-flex items-center gap-1 text-lg font-black text-neutral-900">
                        {promo.discount}
                        <Percent className="w-4 h-4" />
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sm font-bold text-neutral-900">{promo.usedCount}</span>
                        {promo.maxUses && (
                          <span className="text-xs text-neutral-400">/ {promo.maxUses}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center hidden md:table-cell">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 
                          bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Активен
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 
                          bg-neutral-100 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                          Неактивен
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 hidden lg:table-cell">
                      {promo.expiresAt ? (
                        <span className={`text-sm ${isExpired ? "text-red-500 font-bold" : "text-neutral-500"}`}>
                          {new Date(promo.expiresAt).toLocaleDateString("ru")}
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-400">Бессрочно</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <form action={togglePromo.bind(null, promo.id, promo.isActive)}>
                          <button
                            type="submit"
                            className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 
                              rounded-lg transition-all"
                            title={promo.isActive ? "Деактивировать" : "Активировать"}
                          >
                            {promo.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </form>
                        <DeletePromoButton promoId={promo.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {promos.length === 0 && (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет промокодов</h3>
            <p className="text-neutral-500 mb-6">Создайте первый промокод для скидок</p>
            <a
              href="#add-promo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
                rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Создать промокод
            </a>
          </div>
        )}
      </div>

      {/* Add Form */}
      <div id="add-promo" className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Новый промокод</h2>
            <p className="text-sm text-neutral-500">Создайте скидочный код</p>
          </div>
        </div>

        <form action={createPromo} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Код *
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="code"
                  required
                  placeholder="SUMMER2025"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400 font-mono tracking-wider
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    transition-all duration-300 uppercase"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">Только латинские буквы и цифры</p>
            </div>
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
                  placeholder="20"
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
                Макс. использований
              </label>
              <input
                name="maxUses"
                type="number"
                placeholder="Без ограничений"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                  text-neutral-900 placeholder:text-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                  transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Истекает
              </label>
              <input
                name="expiresAt"
                type="date"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                  text-neutral-900
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                  transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3.5 bg-neutral-900 text-white rounded-2xl font-bold
              hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать промокод
          </button>
        </form>
      </div>
    </div>
  )
}