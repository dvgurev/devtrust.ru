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
    const app = await prisma.app.findUnique({ where: { id } })
    if (!app) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const newStatus = app.status === "ACTIVE" ? "DRAFT" : "ACTIVE"
    await prisma.app.update({
        where: { id },
        data: { status: newStatus },
    })

    return NextResponse.json({ status: newStatus })
}