import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
})

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isVerified: z.boolean().optional(),
})

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== "admin@devtrust.ru") {
    return false
  }
  return true
}

export async function GET() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    include: {
      memberships: {
        include: { organization: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validated = createUserSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Email уже используется" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        isVerified: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: "Ошибка при создании" },
      { status: 500 }
    )
  }
}