// apps/web/src/app/api/admin/posts/[id]/toggle-publish/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"

    const data: any = { status: newStatus }

    // Если публикуем впервые — ставим дату
    if (newStatus === "PUBLISHED" && !post.publishedAt) {
        data.publishedAt = new Date()
    }

    await prisma.post.update({
        where: { id },
        data,
    })

    return NextResponse.json({ status: newStatus })
}