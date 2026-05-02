import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  inn: z.string().optional(),
})

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== "admin@devtrust.ru") {
    return false
  }
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const { id } = await params
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: true },
      },
    },
  })

  if (!org) {
    return NextResponse.json({ error: "Организация не найдена" }, { status: 404 })
  }

  return NextResponse.json(org)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const validated = updateOrgSchema.parse(body)

    const org = await prisma.organization.findUnique({
      where: { id },
    })

    if (!org) {
      return NextResponse.json(
        { error: "Организация не найдена" },
        { status: 404 }
      )
    }

    if (validated.slug && validated.slug !== org.slug) {
      const existing = await prisma.organization.findUnique({
        where: { slug: validated.slug },
      })
      if (existing) {
        return NextResponse.json(
          { error: "slug уже используется" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.slug !== undefined) updateData.slug = validated.slug
    if (validated.inn !== undefined) updateData.inn = validated.inn

    const updated = await prisma.organization.update({
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
    console.error("Update org error:", error)
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
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const { id } = await params

  const org = await prisma.organization.findUnique({
    where: { id },
  })

  if (!org) {
    return NextResponse.json({ error: "Организация не найдена" }, { status: 404 })
  }

  await prisma.organization.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}