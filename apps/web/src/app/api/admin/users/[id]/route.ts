import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isVerified: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: "Доступ запрещён" }, { status: admin.status })

  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { organization: true },
      },
      accounts: true,
      sessions: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: "Доступ запрещён" }, { status: admin.status })

  const { id } = await params

  try {
    const body = await request.json()
    const validated = updateUserSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      )
    }

    if (validated.email && validated.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: validated.email },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Email уже используется" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.email !== undefined) updateData.email = validated.email
    if (validated.isVerified !== undefined) updateData.isVerified = validated.isVerified
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12)
    }
    if (validated.role !== undefined) updateData.role = validated.role

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: "Доступ запрещён" }, { status: admin.status })

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
  }

  if (user.role === "ADMIN") {
    return NextResponse.json(
      { error: "Нельзя удалить администратора" },
      { status: 400 }
    )
  }

  await prisma.user.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
