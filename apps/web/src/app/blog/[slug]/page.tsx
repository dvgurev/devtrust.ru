import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, FileText, Rss, Sparkles, Tag, Clock, Share2, BookOpen, User, ArrowRight } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!post) return { title: "Статья не найдена" }
  return {
    title: `${post.title} — DevTrust`,
    description: post.excerpt || undefined,
  }
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  })
}

async function getLatestPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    take: 5,
    orderBy: { publishedAt: "desc" },
  })
}

async function getRelatedPosts(categoryId: string | null, currentSlug: string) {
  if (!categoryId) return []
  return prisma.post.findMany({
    where: { 
      status: "PUBLISHED",
      categoryId,
      NOT: { slug: currentSlug }
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }

  const [latestPosts, relatedPosts] = await Promise.all([
    getLatestPosts(),
    getRelatedPosts(post.categoryId, slug),
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-6 hover:bg-white/80 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к статьям
            </Link>

            <div className="flex items-center gap-3 mb-6">
              {post.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                  <Tag className="w-3 h-3" />
                  {post.category.name}
                </span>
              )}
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 мин чтения
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-slate-700 rounded-xl hover:bg-white/80 transition-all">
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all">
                <BookOpen className="w-4 h-4" />
                Добавить в закладки
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Последние статьи
                </h3>
                <div className="space-y-4">
                  {latestPosts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="block group"
                    >
                      <p className="font-medium text-slate-700 group-hover:text-red-600 line-clamp-2 text-sm transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {p.publishedAt?.toLocaleDateString("ru")}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Об авторе
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">DT</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Команда DevTrust</p>
                      <p className="text-xs text-slate-500">Эксперты по бизнес-приложениям</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link
                    href="/blog/rss.xml"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"
                  >
                    <Rss className="w-4 h-4" />
                    Подписаться на RSS
                  </Link>
                </div>
              </div>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-3">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8 md:p-10">
                <div className="prose prose-slate max-w-none prose-lg">
                  <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </div>

                {/* Tags */}
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4">Теги</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Бизнес", "Приложения", "CRM", "Аналитика", "Автоматизация"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4">Поделиться статьей</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
                      Twitter
                    </button>
                    <button className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                      Facebook
                    </button>
                    <button className="flex-1 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium">
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Похожие статьи</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="group block bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-100 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full font-medium">
                              {post.category.name}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {p.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {p.excerpt || p.content.substring(0, 100)}...
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 mt-3 group-hover:gap-2 transition-all">
                          Читать
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Blog CTA */}
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Вернуться ко всем статьям
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Больше полезных материалов</h2>
              <p className="text-red-100 mb-8">
                Подпишитесь на рассылку, чтобы не пропустить новые статьи и обновления платформы
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