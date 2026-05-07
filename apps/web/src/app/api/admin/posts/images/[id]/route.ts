import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    try {
        // Находим изображение
        const image = await prisma.postImage.findUnique({ where: { id } })
        if (!image) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 })
        }

        // Удаляем файл с диска
        const filePath = path.join(process.cwd(), "public", image.url)
        try {
            await unlink(filePath)
        } catch (error) {
            // Файл может не существовать — это не критично
            console.warn("File not found on disk:", filePath)
        }

        // Удаляем запись из БД
        await prisma.postImage.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete image error:", error)
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
}