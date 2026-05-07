// apps/web/src/app/admin/apps/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Edit, Plus, AppWindow, Star, Sparkles, Zap,
  Eye, ArrowUpRight, CheckCircle
} from "lucide-react"
import { ToggleAppStatusButton } from "@/components/toggle-app-status-button"
import { DeleteAppButton } from "@/components/delete-app-button"

type CategoryType = { id: string; name: string; slug: string }
type AppWithCategory = {
  id: string
  name: string
  slug: string
  status: string
  averageRating: number
  reviewsCount: number
  isFree: boolean
  featured: boolean
  createdAt: Date
  category: CategoryType | null
  iconUrl: string | null
  description: string | null
  subdomain: string | null
  updatedAt: Date
}

export default async function AdminAppsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  async function createApp(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name
      .toLowerCase()
      .replace(/[^a-z0-9а-я-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const isFree = formData.get("isFree") === "on"
    const featured = formData.get("featured") === "on"

    await prisma.app.create({
      data: {
        name,
        slug,
        description: description || null,
        categoryId: categoryId || null,
        isFree,
        featured,
        status: "ACTIVE",
      },
    })
  }

  const apps = await prisma.app.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  }) as AppWithCategory[]

  const categories = await prisma.appCategory.findMany() as CategoryType[]

  const stats = {
    total: apps.length,
    active: apps.filter(a => a.status === "ACTIVE").length,
    free: apps.filter(a => a.isFree).length,
    featured: apps.filter(a => a.featured).length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Приложения
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление каталогом приложений
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="#add-app"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Добавить
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего", value: stats.total, icon: AppWindow, color: "neutral" },
          { label: "Активных", value: stats.active, icon: CheckCircle, color: "emerald" },
          { label: "Featured", value: stats.featured, icon: Sparkles, color: "amber" },
          { label: "Бесплатных", value: stats.free, icon: Zap, color: "violet" },
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
                  Приложение
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Категория
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Статус
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Рейтинг
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {app.iconUrl ? (
                          <img src={app.iconUrl} alt="" className="w-6 h-6 rounded-lg" />
                        ) : (
                          <span className="text-neutral-500 font-bold text-sm">
                            {app.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                            {app.name}
                          </p>
                          <Link
                            href={`/admin/apps/${app.id}`}
                            className="text-neutral-400 hover:text-violet-600 transition-colors flex-shrink-0"
                            title="Редактировать"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {app.featured && (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full">
                              Featured
                            </span>
                          )}
                          {app.isFree && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <span className="text-sm text-neutral-500">
                      {app.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    {app.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 
                        bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Активно
                      </span>
                    ) : app.status === "MAINTENANCE" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 
                        bg-amber-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Обслуживание
                      </span>
                    ) : app.status === "ARCHIVED" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 
                        bg-neutral-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                        Архив
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 
                        bg-neutral-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-neutral-900">
                        {Number(app.averageRating).toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-400">({app.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/apps/${app.slug}`}
                        className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 
                          rounded-lg transition-all"
                        title="Просмотреть на сайте"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <ToggleAppStatusButton
                        appId={app.id}
                        currentStatus={app.status}
                      />
                      <DeleteAppButton appId={app.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {apps.length === 0 && (
          <div className="text-center py-16">
            <AppWindow className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет приложений</h3>
            <p className="text-neutral-500 mb-6">Добавьте первое приложение в каталог</p>
            <a
              href="#add-app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
                rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Добавить приложение
            </a>
          </div>
        )}
      </div>

      {/* Add Form */}
      <div id="add-app" className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Новое приложение</h2>
            <p className="text-sm text-neutral-500">Заполните основную информацию</p>
          </div>
        </div>

        <form action={createApp} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Название *
              </label>
              <input
                name="name"
                required
                placeholder="Analytics Pro"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                  text-neutral-900 placeholder:text-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                  transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Slug
              </label>
              <input
                name="slug"
                placeholder="analytics-pro"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                  text-neutral-900 placeholder:text-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                  transition-all duration-300"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Оставьте пустым для автогенерации
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Категория
            </label>
            <select
              name="categoryId"
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
              Описание
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Опишите возможности приложения..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                text-neutral-900 placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex gap-6 p-4 bg-neutral-50 rounded-2xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
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
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
              />
              <span className="text-sm font-medium text-neutral-700">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Featured
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3.5 bg-neutral-900 text-white rounded-2xl font-bold
              hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать приложение
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2">
          <Link
            href="/admin/categories"
            className="flex items-center justify-between p-3 text-sm text-neutral-600 
              hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
          >
            Управление категориями
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/catalog"
            className="flex items-center justify-between p-3 text-sm text-neutral-600 
              hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
          >
            Открыть каталог
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}