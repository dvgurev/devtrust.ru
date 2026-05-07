import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  FileText, Calendar, Rss, Sparkles,
  Clock, ArrowUpRight, X
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Блог — DevTrust",
  description: "Новости и статьи о бизнес-приложениях",
}

async function getPosts(categorySlug?: string) {
  const where: any = { status: "PUBLISHED" }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  return prisma.post.findMany({
    where,
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  })
}

async function getCategories() {
  return prisma.postCategory.findMany()
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const [posts, categories] = await Promise.all([
    getPosts(category),
    getCategories(),
  ])

  const currentCategory = category
    ? categories.find(c => c.slug === category)
    : null

  const featuredPost = posts.length > 0 ? posts[0] : null
  const regularPosts = featuredPost ? posts.slice(1) : posts

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-neutral-300">
                {currentCategory
                  ? `Блог — ${currentCategory.name}`
                  : "Блог DevTrust"
                }
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6">
              {currentCategory ? (
                currentCategory.name
              ) : (
                <>
                  Полезные материалы
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                    для вашего бизнеса
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-neutral-400 max-w-xl mb-8">
              {posts.length} {posts.length === 1 ? "статья" : posts.length < 5 ? "статьи" : "статей"} в категории
            </p>

            <div className="flex flex-wrap gap-3">
              {/* Active filter */}
              {currentCategory && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 
                    text-white rounded-full font-bold text-sm hover:bg-white/20 
                    transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Сбросить фильтр
                </Link>
              )}
              {!currentCategory && (
                <Link
                  href="#posts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 
                    rounded-full font-bold hover:bg-neutral-100 transition-all duration-300"
                >
                  Читать статьи
                  <ArrowDown className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 
                  text-white rounded-full font-bold hover:border-neutral-500 
                  transition-all duration-300"
              >
                <Rss className="w-4 h-4" />
                RSS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !category && (
        <section className="py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden
              hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500">
              <div className="grid md:grid-cols-2">
                {/* Cover Image */}
                <div className="aspect-[4/3] md:aspect-auto bg-neutral-100 relative overflow-hidden">
                  {(featuredPost as any).coverImage ? (
                    <img
                      src={(featuredPost as any).coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100
                      flex items-center justify-center">
                      <FileText className="w-24 h-24 text-violet-300/50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-neutral-900 
                      rounded-full text-sm font-bold shadow-sm">
                      {featuredPost.category?.name || "Статья"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                    </span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      5 мин чтения
                    </span>
                  </div>

                  <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-neutral-900 mb-4
                    hover:text-violet-600 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-neutral-500 leading-relaxed mb-6">
                    {featuredPost.excerpt || featuredPost.content?.slice(0, 200)}
                  </p>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-violet-600 font-bold 
                      hover:text-violet-700 transition-colors group"
                  >
                    Читать статью
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section id="posts" className="py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                {currentCategory ? currentCategory.name : "Все статьи"}
              </p>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-neutral-900">
                {currentCategory ? "Материалы по теме" : "Последние материалы"}
              </h2>
            </div>

            {categories.length > 0 && (
              <div className="hidden md:flex gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}#posts`}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium
                      ${category === cat.slug
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:border-neutral-300"
                      }`}
                  >
                    {cat.name}
                  </Link>
                ))}
                {category && (
                  <Link
                    href="/blog#posts"
                    className="px-4 py-2 rounded-full bg-white border border-neutral-200 
                      text-sm font-medium text-neutral-400 hover:text-neutral-600 
                      transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Posts list */}
          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group bg-white rounded-3xl border border-neutral-100 overflow-hidden
                    hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500 
                    hover:-translate-y-1 h-full flex flex-col">

                    <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center relative overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-neutral-300 group-hover:text-violet-300 
                          transition-colors duration-500" />
                      )}
                      {post.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-neutral-700 
                            rounded-full text-xs font-bold shadow-sm">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </div>

                      <h3 className="text-lg font-bold text-neutral-900 mb-2 
                        group-hover:text-violet-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-neutral-500 leading-relaxed mb-4 flex-1 line-clamp-2">
                        {post.excerpt || post.content?.slice(0, 100)}
                      </p>

                      <div className="flex items-center gap-2 text-sm font-medium text-violet-600 
                        group-hover:text-violet-700 transition-colors">
                        Читать
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 
                          group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">Статьи не найдены</p>
              <Link
                href="/blog"
                className="text-violet-600 font-bold hover:text-violet-700 mt-2 inline-block"
              >
                Показать все статьи
              </Link>
            </div>
          )}

          {/* Mobile Categories */}
          <div className="md:hidden mt-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}#posts`}
                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${category === cat.slug
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200"
                  }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="relative bg-neutral-900 rounded-3xl p-10 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                Будьте в курсе новостей
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
                Подпишитесь на рассылку и получайте новые статьи первыми
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-2xl
                    text-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-400
                    transition-all duration-300"
                />
                <button className="px-6 py-3.5 bg-white text-neutral-900 rounded-2xl font-bold
                  hover:bg-neutral-100 transition-all duration-300">
                  Подписаться
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v8m0 0l3-3m-3 3L5 8" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}