import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Calendar, ArrowRight, Rss, Sparkles, Tag } from "lucide-react"

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
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Блог DevTrust</div>
            <h1 className="font-display text-6xl md:text-[10rem] leading-tight tracking-[-0.04em] text-fg mb-6">
              Полезные материалы
              <br />
              <span className="text-fg">для вашего бизнеса</span>
            </h1>
            <p className="text-muted font-mono text-sm max-w-2xl mx-auto">
              Новости, статьи и руководства по бизнес-приложениям, CRM, аналитике и автоматизации
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="#posts">
                <div className="font-mono text-xs uppercase tracking-widest border-2 border-accent bg-accent text-bg px-8 py-4 hover:bg-accent/90 transition-all inline-flex items-center gap-2">
                  Читать статьи
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link href="/blog/rss.xml">
                <div className="font-mono text-xs uppercase tracking-widest border-2 border-border px-8 py-4 text-fg hover:border-fg transition-all inline-flex items-center gap-2">
                  <Rss className="w-4 h-4" />
                  Подписаться на RSS
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 border-b-2 border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="border-2 border-border aspect-[16/9] bg-fg/5 flex items-center justify-center">
                <FileText className="w-16 h-16 text-fg/20" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                  {featuredPost.category?.name || "Статья"}
                </div>
                <h2 className="font-display text-4xl md:text-5xl mb-4 text-fg hover:text-accent transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="text-muted font-mono text-sm mb-6">
                  {featuredPost.excerpt || featuredPost.content?.slice(0, 200)}
                </p>
                <div className="flex items-center gap-4 font-mono text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString("ru")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section id="posts" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-3 text-fg">Все статьи</h2>
              <p className="font-mono text-sm text-muted">Последние новости и обновления</p>
            </div>
            {categories.length > 0 && (
              <div className="hidden md:flex gap-2">
                {categories.slice(0, 3).map((cat: any) => (
                  <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                    <div className="font-mono text-xs uppercase tracking-widest border-2 border-border px-4 py-2 text-muted hover:border-fg hover:text-fg transition-all">
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="border-2 border-border hover:border-fg/50 transition-all h-full">
                  <div className="w-full aspect-[16/9] bg-fg/5 flex items-center justify-center border-b-2 border-border">
                    <FileText className="w-12 h-12 text-fg/20" />
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
                      {post.category?.name || "Статья"}
                    </div>
                    <h3 className="font-display text-2xl mb-3 text-fg hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted font-mono text-sm mb-4 line-clamp-2">
                      {post.excerpt || post.content?.slice(0, 100)}
                    </p>
                    <div className="flex items-center gap-4 font-mono text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString("ru")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
