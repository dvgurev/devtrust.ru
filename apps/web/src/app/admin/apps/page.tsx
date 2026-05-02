import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Plus, AppWindow, Star, Search, Filter, Download, Eye, CheckCircle, XCircle, ArrowUpDown, Sparkles, Zap, TrendingUp, Package, Shield, ArrowRight } from "lucide-react"

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
}

export default async function AdminAppsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.email === "admin@devtrust.ru"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  async function createApp(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9а-я]/g, "-")
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

  async function deleteApp(appId: string) {
    "use server"
    await prisma.app.delete({
      where: { id: appId },
    })
  }

  async function toggleAppStatus(appId: string, currentStatus: string) {
    "use server"
    await prisma.app.update({
      where: { id: appId },
      data: {
        status: currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE",
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-blue-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <AppWindow className="w-4 h-4" />
                  Управление контентом
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Каталог приложений
                </h1>
                <p className="text-lg text-slate-600">Добавляйте, редактируйте и управляйте приложениями платформы</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/categories"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <Package className="w-4 h-4" />
                  Категории
                </Link>
                <Link
                  href="#add-app"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Добавить приложение
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                    <AppWindow className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500 mt-1">Приложений в каталоге</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Активные
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
                  <div className="text-sm text-slate-500 mt-1">Опубликовано</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Премиум
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.featured}</div>
                  <div className="text-sm text-slate-500 mt-1">Рекомендуемых</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600 group-hover:from-violet-200 group-hover:to-violet-300 transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Бесплатные
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.free}</div>
                  <div className="text-sm text-slate-500 mt-1">Бесплатный доступ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Apps List */}
              <div className="lg:col-span-2">
                {/* Filters and Search */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Поиск по названию..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all">
                        <Filter className="w-3.5 h-3.5" />
                        Фильтры
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Сортировка
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all">
                        <Download className="w-3.5 h-3.5" />
                        Экспорт
                      </button>
                    </div>
                  </div>
                </div>

                {/* Apps Table */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/30">
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Приложение</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Категория</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Статус</th>
                          <th className="text-center py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Рейтинг</th>
                          <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/20">
                        {apps.map((app) => (
                          <tr key={app.id} className="group hover:bg-white/40 transition-all duration-200">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all flex-shrink-0">
                                  <AppWindow className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[180px]">
                                    {app.name}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {app.featured && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded-full border border-amber-200">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Featured
                                      </span>
                                    )}
                                    {app.isFree && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full border border-emerald-200">
                                        Free
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <span className="text-sm text-slate-600">
                                {app.category?.name || <span className="text-slate-400 text-xs">—</span>}
                              </span>
                            </td>
                            <td className="py-3 px-5">
                              {app.status === "ACTIVE" ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Активно
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                  Черновик
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center justify-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-bold text-slate-900">{app.averageRating.toFixed(1)}</span>
                                <span className="text-xs text-slate-400">({app.reviewsCount})</span>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/admin/apps/${app.id}/edit`}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Редактировать"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <Link
                                  href={`/apps/${app.slug}`}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Просмотреть"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <form action={toggleAppStatus.bind(null, app.id, app.status)} className="inline">
                                  <button
                                    type="submit"
                                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                    title={app.status === "ACTIVE" ? "Скрыть" : "Опубликовать"}
                                  >
                                    {app.status === "ACTIVE" ? (
                                      <XCircle className="w-4 h-4" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                  </button>
                                </form>
                                <form action={deleteApp.bind(null, app.id)} className="inline">
                                  <button
                                    type="submit"
                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Удалить"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </form>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {apps.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                        <AppWindow className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Нет приложений</h3>
                      <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">Добавьте первое приложение в каталог</p>
                      <Link
                        href="#add-app"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Добавить приложение
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Add App Form */}
              <div>
                <div id="add-app" className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 sticky top-24">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-xl text-slate-900">Новое приложение</h2>
                      <p className="text-sm text-slate-500">Заполните информацию</p>
                    </div>
                  </div>
                  
                  <form action={createApp} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Название приложения *
                      </label>
                      <input 
                        name="name" 
                        required 
                        placeholder="Например: Analytics Pro"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        URL-адрес (slug)
                      </label>
                      <input 
                        name="slug" 
                        placeholder="analytics-pro"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">Оставьте пустым для авто-генерации</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Категория
                      </label>
                      <select 
                        name="categoryId"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Краткое описание
                      </label>
                      <textarea 
                        name="description" 
                        rows={3}
                        placeholder="Опишите возможности приложения..."
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-3 bg-slate-50/60 rounded-xl p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFree"
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Бесплатное приложение
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Показывать на главной (featured)
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Создать приложение
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-white/30">
                    <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Управление
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/admin/categories"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group"
                      >
                        <span>Категории приложений</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        href="/admin/plans"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group"
                      >
                        <span>Тарифные планы</span>
                        <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        href="/catalog"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group"
                      >
                        <span>Просмотреть каталог</span>
                        <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}