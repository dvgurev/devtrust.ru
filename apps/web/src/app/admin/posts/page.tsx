import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Plus, FileText, Calendar, Search, Eye, Archive, Globe, Filter, ArrowUpDown, Sparkles, Zap, ArrowRight, Shield, Tag, TrendingUp } from "lucide-react"

type CategoryType = { id: string; name: string }
type PostType = {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: Date | null
  category: CategoryType | null
}

export default async function AdminPostsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "ADMIN"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  async function createPost(formData: FormData) {
    "use server"
    const title = formData.get("title") as string
    const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9а-я]/g, "-").replace(/-+/g, "-")
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const categoryId = formData.get("categoryId") as string
    const status = formData.get("status") as string

    await prisma.post.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt: excerpt || null,
        categoryId: categoryId || null,
        status: status as any,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    })
  }

  async function deletePost(postId: string) {
    "use server"
    await prisma.post.delete({
      where: { id: postId },
    })
  }

  async function togglePublish(postId: string, currentStatus: string) {
    "use server"
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: newStatus as any,
        publishedAt: newStatus === "PUBLISHED" ? new Date() : null,
      },
    })
  }

  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  }) as PostType[]

  const categories = await prisma.postCategory.findMany() as CategoryType[]

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "PUBLISHED").length,
    drafts: posts.filter(p => p.status === "DRAFT").length,
    categories: categories.length,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-blue-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-cyan-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <FileText className="w-4 h-4" />
                  Управление контентом
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Управление блогом
                </h1>
                <p className="text-lg text-slate-600">Создание и редактирование статей на платформе</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/categories"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <Tag className="w-4 h-4" />
                  Категории
                </Link>
                <Link
                  href="#add-post"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Новая статья
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
                  <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100 transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500 mt-1">Статей в блоге</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-all">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Опубликовано
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.published}</div>
                  <div className="text-sm text-slate-500 mt-1">Доступны читателям</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-all">
                    <Archive className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Черновики
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.drafts}</div>
                  <div className="text-sm text-slate-500 mt-1">В разработке</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-all">
                    <Tag className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Категории
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.categories}</div>
                  <div className="text-sm text-slate-500 mt-1">Тематических рубрик</div>
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
              {/* Left Column - Posts List */}
              <div className="lg:col-span-2">
                {/* Filters and Search */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Поиск по заголовку или категории..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 text-cyan-700 text-sm font-medium rounded-xl hover:from-cyan-100 hover:to-blue-100 transition-all">
                        <Filter className="w-3.5 h-3.5" />
                        Статус
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Сортировка
                      </button>
                    </div>
                  </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/30">
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Заголовок</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Категория</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Статус</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Дата</th>
                          <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/20">
                        {posts.map((post: PostType) => (
                          <tr key={post.id} className="group hover:bg-white/40 transition-all duration-200">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center group-hover:from-cyan-200 group-hover:to-blue-200 transition-all flex-shrink-0">
                                  <FileText className="w-4 h-4 text-cyan-600" />
                                </div>
                                <div className="min-w-0">
                                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors truncate block max-w-[280px]">
                                    {post.title}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <span className="text-sm text-slate-600">
                                {post.category?.name || <span className="text-slate-400 text-xs">—</span>}
                              </span>
                            </td>
                            <td className="py-3 px-5">
                              {post.status === "PUBLISHED" ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Опубликовано
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  Черновик
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                  {post.publishedAt?.toLocaleDateString("ru") || "—"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                  title="Просмотреть"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  href={`/admin/posts/${post.id}/edit`}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Редактировать"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <form action={togglePublish.bind(null, post.id, post.status)} className="inline">
                                  <button
                                    className={`p-1.5 rounded-lg transition-all ${
                                      post.status === "PUBLISHED"
                                        ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                        : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                    title={post.status === "PUBLISHED" ? "Снять с публикации" : "Опубликовать"}
                                  >
                                    {post.status === "PUBLISHED" ? (
                                      <Archive className="w-4 h-4" />
                                    ) : (
                                      <Globe className="w-4 h-4" />
                                    )}
                                  </button>
                                </form>
                                <form action={deletePost.bind(null, post.id)} className="inline">
                                  <button
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

                  {posts.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-cyan-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Нет статей</h3>
                      <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                        Создайте первую статью для блога платформы
                      </p>
                      <Link
                        href="#add-post"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Написать статью
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Add Post Form */}
              <div>
                <div id="add-post" className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 sticky top-24">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100">
                      <Plus className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-xl text-slate-900">Новая статья</h2>
                      <p className="text-sm text-slate-500">Заполните информацию</p>
                    </div>
                  </div>

                  <form action={createPost} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Заголовок *
                      </label>
                      <input
                        name="title"
                        required
                        placeholder="Заголовок статьи"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        URL (slug)
                      </label>
                      <input
                        name="slug"
                        placeholder="url-adres-stati"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">Оставьте пустым для авто-генерации</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Категория
                        </label>
                        <select
                          name="categoryId"
                          className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        >
                          <option value="">Без категории</option>
                          {categories.map((cat: CategoryType) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Статус
                        </label>
                        <select
                          name="status"
                          className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        >
                          <option value="DRAFT">Черновик</option>
                          <option value="PUBLISHED">Опубликовать сразу</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Отрывок (excerpt)
                      </label>
                      <input
                        name="excerpt"
                        placeholder="Краткое описание для превью..."
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Содержание *
                      </label>
                      <textarea
                        name="content"
                        placeholder="<p>Содержание статьи в HTML...</p>"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-sm resize-none"
                        rows={6}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Создать статью
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-white/30">
                    <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-500" />
                      Управление
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/admin/categories"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors group"
                      >
                        <span>Категории блога</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors group"
                      >
                        <span>Просмотреть блог</span>
                        <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        href="/admin/analytics"
                        className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors group"
                      >
                        <span>Статистика просмотров</span>
                        <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Контент-стратегия</h3>
                  </div>
                  <p className="text-slate-300 text-lg max-w-2xl">
                    Регулярно публикуйте полезные статьи и кейсы для привлечения новых пользователей на платформу.
                  </p>
                </div>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Аналитика блога
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
