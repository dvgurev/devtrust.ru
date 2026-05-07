// apps/web/src/app/admin/posts/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
  Edit, Trash2, Plus, FileText, Calendar, Eye,
  Globe, Archive, Tag, Sparkles, ArrowUpRight,
  CheckCircle, Clock
} from "lucide-react"
import { TogglePublishButton } from "@/components/toggle-publish-button"
import { DeletePostButton } from "@/components/delete-post-button"

type CategoryType = { id: string; name: string }
type PostType = {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: Date | null
  createdAt: Date
  category: CategoryType | null
  excerpt: string | null
  coverImage: string | null
}

export default async function AdminPostsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  async function createPost(formData: FormData) {
    "use server"
    const title = formData.get("title") as string
    const slug = (formData.get("slug") as string) || title
      .toLowerCase()
      .replace(/[^a-z0-9а-я-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const categoryId = formData.get("categoryId") as string
    const status = formData.get("status") as string

    const post = await prisma.post.create({
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

    revalidatePath("/admin/posts")

    // Редирект на редактирование созданного поста
    redirect(`/admin/posts/${post.id}`)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Блог
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление статьями и публикациями
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="#add-post"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Новая статья
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего", value: stats.total, icon: FileText, color: "neutral" },
          { label: "Опубликовано", value: stats.published, icon: Globe, color: "emerald" },
          { label: "Черновиков", value: stats.drafts, icon: Archive, color: "amber" },
          { label: "Категорий", value: stats.categories, icon: Tag, color: "violet" },
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
                  Заголовок
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Категория
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Статус
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Дата
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-neutral-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                            {post.title}
                          </p>
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="text-neutral-400 hover:text-violet-600 transition-colors flex-shrink-0"
                            title="Редактировать"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <span className="text-sm text-neutral-500">
                      {post.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    {post.status === "PUBLISHED" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 
                        bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Опубликовано
                      </span>
                    ) : post.status === "ARCHIVED" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 
                        bg-neutral-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                        Архив
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 
                        bg-amber-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">
                    <span className="text-sm text-neutral-500">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("ru")
                        : new Date(post.createdAt).toLocaleDateString("ru")}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 
                          rounded-lg transition-all"
                        title="Просмотреть"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-2 text-neutral-400 hover:text-violet-600 hover:bg-violet-50 
                          rounded-lg transition-all"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <TogglePublishButton
                        postId={post.id}
                        currentStatus={post.status}
                      />
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет статей</h3>
            <p className="text-neutral-500 mb-6">Создайте первую статью для блога</p>
            <a
              href="#add-post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white 
                rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Написать статью
            </a>
          </div>
        )}
      </div>

      {/* Add Form */}
      <div id="add-post" className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Новая статья</h2>
            <p className="text-sm text-neutral-500">Заполните информацию</p>
          </div>
        </div>

        <form action={createPost} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Заголовок *
              </label>
              <input
                name="title"
                required
                placeholder="Заголовок статьи"
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
                placeholder="url-adres-stati"
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

          <div className="grid sm:grid-cols-2 gap-5">
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
                Статус
              </label>
              <select
                name="status"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                  text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 
                  focus:border-violet-500 transition-all duration-300"
              >
                <option value="DRAFT">Черновик</option>
                <option value="PUBLISHED">Опубликовать сразу</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Отрывок (excerpt)
            </label>
            <input
              name="excerpt"
              placeholder="Краткое описание для превью..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                text-neutral-900 placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Содержание *
            </label>
            <textarea
              name="content"
              rows={8}
              placeholder="Содержание статьи в HTML..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                text-neutral-900 placeholder:text-neutral-400 font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                transition-all duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3.5 bg-neutral-900 text-white rounded-2xl font-bold
              hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать статью
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2">
          <Link
            href="/admin/categories"
            className="flex items-center justify-between p-3 text-sm text-neutral-600 
              hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
          >
            Категории блога
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="flex items-center justify-between p-3 text-sm text-neutral-600 
              hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
          >
            Открыть блог
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
} 