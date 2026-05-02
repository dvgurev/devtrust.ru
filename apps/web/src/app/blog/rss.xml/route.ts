import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  })

  const siteUrl = process.env.SITE_URL || "https://devtrust.ru"
  const now = new Date().toISOString()

  const entries = posts
    .filter((p) => p.publishedAt)
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`
      const updated = post.updatedAt?.toISOString() || now
      return `
  <entry>
    <title type="html">${escapeXml(post.title)}</title>
    <link href="${escapeXml(link)}" rel="alternate" type="text/html" />
    <id>${escapeXml(link)}</id>
    <updated>${escapeXml(updated)}</updated>
    <published>${escapeXml(post.publishedAt!.toISOString())}</published>
    ${post.category ? `<category term="${escapeXml(post.category.name)}" />` : ""}
    <summary type="html">${escapeXml(post.excerpt || post.content.slice(0, 200))}</summary>
    <content type="html">${escapeXml(post.content)}</content>
    <author>
      <name>DevTrust</name>
    </author>
  </entry>`
    })
    .join("")

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>DevTrust — Блог</title>
  <subtitle>Новости и статьи о бизнес-приложениях</subtitle>
  <link href="${siteUrl}/blog/rss.xml" rel="self" type="application/atom+xml" />
  <link href="${siteUrl}/blog" rel="alternate" type="text/html" />
  <id>${siteUrl}/blog</id>
  <updated>${now}</updated>
  <logo>${siteUrl}/favicon.ico</logo>
  <generator>DevTrust Platform</generator>${entries}
</feed>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
