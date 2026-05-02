import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"
import { z } from "zod"

const createExternalAppSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  externalUrl: z.string().url().optional(),
  customDomain: z.string().optional(),
  allowedDomains: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apps = await prisma.app.findMany({
      where: { isExternal: true },
      include: {
        externalConfig: true,
        category: true,
        plans: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(apps)
  } catch (error) {
    console.error("Get external apps error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createExternalAppSchema.parse(body)

    const existing = await prisma.app.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const app = await prisma.app.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        externalUrl: data.externalUrl,
        customDomain: data.customDomain,
        isExternal: true,
        status: "ACTIVE",
        externalConfig: {
          create: {
            ssoEnabled: true,
            apiSecret: randomBytes(32).toString("hex"),
            allowedDomains: data.allowedDomains || [],
          },
        },
      },
      include: {
        externalConfig: true,
      },
    })

    return NextResponse.json(app)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Create external app error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}