import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrgSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  inn: z.string().optional(),
})

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  inn: z.string().optional(),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: "Доступ запрещён" }, { status: admin.status })

  const orgs = await prisma.organization.findMany({
    include: {
      memberships: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orgs)
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: "Доступ запрещён" }, { status: admin.status })

  try {
    const body = await request.json()
    const validated = createOrgSchema.parse(body)

    const existing = await prisma.organization.findUnique({
      where: { slug: validated.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "slug уже используется" },
        { status: 400 }
      )
    }

    const org = await prisma.organization.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        inn: validated.inn,
      },
    })

    return NextResponse.json(org)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Create org error:", error)
    return NextResponse.json(
      { error: "Ошибка при создании" },
      { status: 500 }
    )
  }
}
