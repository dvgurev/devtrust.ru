import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Calendar, ArrowRight, Rss, Sparkles, Tag, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Блог — DevTrust",
  description: "Новости и статьи о бизнес-приложениях",
}

async function getPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  })
}

async function getCategories() {
  return prisma.postCategory.findMany()
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ])

  const featuredPost = posts.length > 0 ? posts[0] : null
  const regularPosts = featuredPost ? posts.slice(1) : posts

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Блог DevTrust
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Полезные материалы
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                для вашего бизнеса
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Новости, статьи и руководства по бизнес-приложениям, CRM, аналитике и автоматизации
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#posts"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
              >
                Читать статьи
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-xl border border-white/40 text-slate-900 font-semibold rounded-2xl hover:bg-white/80 transition-all"
              >
                <Rss className="w-5 h-5" />
                Подписаться на RSS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="relative -mt-10 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {featuredPost.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                          <Tag className="w-3 h-3" />
                          {featuredPost.category.name}
                        </span>
                      )}
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-600 mb-6 line-clamp-3">
                      {featuredPost.excerpt || featuredPost.content.substring(0, 200)}...
                    </p>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
                    >
                      Читать статью полностью
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <span className="text-sm font-medium text-red-600">Рекомендуем к прочтению</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="posts" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Категории
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className="block px-4 py-3 text-sm rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Все статьи
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className="block px-4 py-3 text-sm rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Популярные темы
                  </h3>
                  <div className="space-y-2">
                    {["CRM", "Аналитика", "Документы", "Автоматизация", "Безопасность"].map((topic) => (
                      <span
                        key={topic}
                        className="inline-block px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg mr-2 mb-2"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <Link
                    href="/blog/rss.xml"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Rss className="w-4 h-4" />
                    Подписаться на RSS
                  </Link>
                </div>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Последние статьи</h2>
                <div className="text-sm text-slate-500">
                  {posts.length} {posts.length === 1 ? 'статья' : posts.length < 5 ? 'статьи' : 'статей'}
                </div>
              </div>

              {regularPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <div key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-100 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {post.category && (
                            <span className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-full font-medium">
                              {post.category.name}
                            </span>
                          )}
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150)}...
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600 group-hover:gap-3 transition-all">
                          Читать далее
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Статьи пока не опубликованы
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Следите за обновлениями — скоро здесь появятся интересные материалы о бизнес-приложениях
                  </p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-medium rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
                  >
                    Открыть каталог
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Будьте в курсе новостей</h2>
              <p className="text-red-100 mb-8">
                Подпишитесь на рассылку, чтобы первыми получать новые статьи и обновления платформы
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-red-100 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Подписаться
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}