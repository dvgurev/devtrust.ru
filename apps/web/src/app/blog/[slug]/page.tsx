// apps/web/src/app/blog/[slug]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Calendar, ArrowLeft, FileText, Rss, Clock, Share2,
  BookOpen, User, Sparkles, ChevronRight
} from "lucide-react"

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
    openGraph: post.coverImage ? {
      images: [{ url: post.coverImage }],
    } : undefined,
  }
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  })
}

async function getLatestPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    take: 5,
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, publishedAt: true },
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
    select: {
      id: true, title: true, slug: true,
      publishedAt: true, excerpt: true, coverImage: true
    },
  })
}

function formatDate(date: Date | null): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const [latestPosts, relatedPosts] = await Promise.all([
    getLatestPosts(),
    getRelatedPosts(post.categoryId, slug),
  ])

  const readingTime = getReadingTime(post.content || "")

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Cover Image - Full Width Hero */}
      {post.coverImage ? (
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-neutral-900/20" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16">
            <div className="max-w-[1200px] mx-auto">
              <div className="max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-300 mb-4">
                  <Link href="/blog" className="hover:text-white transition-colors">Блог</Link>
                  <ChevronRight className="w-4 h-4" />
                  {post.category && (
                    <>
                      <Link href={`/blog?category=${post.category.slug}`} className="hover:text-white transition-colors">
                        {post.category.name}
                      </Link>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                  <span className="text-white/80 truncate">{post.title}</span>
                </div>

                {/* Category & Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {post.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 
                      bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      {post.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                    <Clock className="w-4 h-4" />
                    {readingTime} мин чтения
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl mt-4">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback Hero without cover */
        <section className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
                <Link href="/blog" className="hover:text-white transition-colors">Блог</Link>
                <ChevronRight className="w-4 h-4" />
                {post.category && (
                  <>
                    <Link href={`/blog?category=${post.category.slug}`} className="hover:text-white transition-colors">
                      {post.category.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                <span className="text-white truncate">{post.title}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 
                    bg-violet-500/20 text-violet-300 rounded-full text-sm font-bold">
                    <FileText className="w-3.5 h-3.5" />
                    {post.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                  <Clock className="w-4 h-4" />
                  {readingTime} мин чтения
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-neutral-400 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Actions */}
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 
                      text-sm font-medium text-neutral-600 hover:text-neutral-900 
                      hover:bg-neutral-50 rounded-xl transition-all">
                      <Share2 className="w-4 h-4" />
                      Поделиться
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 
                      text-sm font-medium text-neutral-600 hover:text-neutral-900 
                      hover:bg-neutral-50 rounded-xl transition-all">
                      <BookOpen className="w-4 h-4" />
                      В закладки
                    </button>
                    <Link
                      href="/blog"
                      className="w-full flex items-center gap-3 px-4 py-2.5 
                        text-sm font-medium text-neutral-600 hover:text-neutral-900 
                        hover:bg-neutral-50 rounded-xl transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Все статьи
                    </Link>
                  </div>
                </div>

                {/* Latest Posts */}
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                  <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-500" />
                    Последние
                  </h3>
                  <div className="space-y-4">
                    {latestPosts.map((p) => (
                      <Link key={p.id} href={`/blog/${p.slug}`} className="block group">
                        <p className="text-sm font-bold text-neutral-700 group-hover:text-violet-600 
                          line-clamp-2 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {formatDate(p.publishedAt)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Author */}
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold text-sm">DT</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Команда DevTrust</p>
                      <p className="text-xs text-neutral-500">Эксперты</p>
                    </div>
                  </div>
                </div>

                {/* RSS */}
                <Link
                  href="/blog/rss.xml"
                  className="flex items-center gap-2 text-sm font-medium text-neutral-500 
                    hover:text-violet-600 transition-colors"
                >
                  <Rss className="w-4 h-4" />
                  RSS лента
                </Link>
              </div>
            </aside>

            {/* Article */}
            <article className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-neutral-100 p-8 lg:p-12">
                {/* Content */}
                <div className="prose prose-neutral prose-lg max-w-none
                  prose-headings:font-black prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-neutral-600 prose-p:leading-relaxed
                  prose-a:text-violet-600 prose-a:no-underline hover:prose-a:text-violet-700
                  prose-strong:text-neutral-900 prose-strong:font-bold
                  prose-li:text-neutral-600
                  prose-img:rounded-2xl">
                  <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <h3 className="text-xl font-bold text-neutral-900">Похожие статьи</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                          hover:shadow-lg hover:border-violet-200 transition-all duration-300"
                      >
                        {p.coverImage ? (
                          <div className="aspect-video bg-neutral-100 overflow-hidden">
                            <img
                              src={p.coverImage}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-neutral-100 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-neutral-300" />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <span className="px-2 py-0.5 bg-violet-50 text-violet-600 
                                rounded-full text-xs font-bold">
                                {post.category.name}
                              </span>
                            )}
                            <span className="text-xs text-neutral-400">
                              {p.publishedAt ? formatDate(p.publishedAt) : ""}
                            </span>
                          </div>
                          <h4 className="font-bold text-neutral-900 mb-1 group-hover:text-violet-600 
                            transition-colors line-clamp-2">
                            {p.title}
                          </h4>
                          {p.excerpt && (
                            <p className="text-sm text-neutral-500 line-clamp-2">{p.excerpt}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back */}
              <div className="mt-10 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white 
                    rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Все статьи
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="relative bg-neutral-900 rounded-3xl p-10 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
            <div className="relative">
              <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h2 className="text-2xl lg:text-4xl font-black text-white mb-3">
                Больше полезных материалов
              </h2>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto">
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