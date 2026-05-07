import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, FileText, Rss, Clock, Share2, BookOpen, User, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 border-b-2 border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-surface text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к статьям
            </Link>

            <div className="flex items-center gap-3 mb-6">
              {post.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-border bg-surface text-accent font-mono text-xs uppercase tracking-widest">
                  <FileText className="w-3 h-3" />
                  {post.category.name}
                </span>
              )}
              <span className="font-mono text-xs uppercase tracking-widest text-muted flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 мин чтения
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-fg leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted mb-8 max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-surface text-fg font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                <BookOpen className="w-4 h-4" />
                Добавить в закладки
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="border-2 border-border bg-surface p-6 sticky top-24">
                <h3 className="font-display text-fg mb-4 flex items-center gap-2">
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
                      <p className="font-medium text-fg group-hover:text-accent line-clamp-2 text-sm transition-colors">
                        {p.title}
                      </p>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {p.publishedAt?.toLocaleDateString("ru")}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-border">
                  <h3 className="font-display text-fg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Об авторе
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-border bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold">DT</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-fg">Команда DevTrust</p>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted">Эксперты по бизнес-приложениям</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-border">
                  <Link
                    href="/blog/rss.xml"
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg hover:text-accent transition-colors"
                  >
                    <Rss className="w-4 h-4" />
                    Подписаться на RSS
                  </Link>
                </div>
              </div>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-3">
              <div className="border-2 border-border bg-surface p-8 md:p-10">
                <div className="prose prose-slate max-w-none prose-lg">
                  <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </div>

                {/* Tags */}
                <div className="mt-10 pt-8 border-t-2 border-border">
                  <h4 className="font-display text-fg mb-4">Теги</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Бизнес", "Приложения", "CRM", "Аналитика", "Автоматизация"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 font-mono text-xs uppercase tracking-widest border-2 border-border bg-bg text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 pt-8 border-t-2 border-border">
                  <h4 className="font-display text-fg mb-4">Поделиться статьей</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 border-2 border-border bg-surface text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors">
                      Twitter
                    </button>
                    <button className="flex-1 py-3 border-2 border-border bg-surface text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors">
                      Facebook
                    </button>
                    <button className="flex-1 py-3 border-2 border-border bg-fg text-bg font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display text-2xl text-fg mb-6">Похожие статьи</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="group block border-2 border-border bg-surface p-6 hover:border-accent transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="font-mono text-xs uppercase tracking-widest px-2 py-1 border border-border bg-bg text-accent">
                              {post.category.name}
                            </span>
                          )}
                          <span className="font-mono text-xs uppercase tracking-widest text-muted">
                            {p.publishedAt?.toLocaleDateString("ru", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <h4 className="font-display text-fg mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <p className="text-sm text-muted line-clamp-2">
                          {p.excerpt || p.content.substring(0, 100)}...
                        </p>
                        <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent mt-3 group-hover:gap-2 transition-all">
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
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-bg font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
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
      <section className="py-20 border-t-2 border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-border bg-accent p-8 md:p-12 text-bg text-center">
              <h2 className="font-display text-2xl md:text-3xl mb-4">Больше полезных материалов</h2>
              <p className="text-accent/80 mb-8 font-mono text-sm">
                Подпишитесь на рассылку, чтобы не пропустить новые статьи и обновления платформы
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 border-2 border-bg/30 bg-bg/20 font-mono text-sm text-bg placeholder:text-bg/60 focus:outline-none focus:border-bg"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-bg text-accent font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
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
