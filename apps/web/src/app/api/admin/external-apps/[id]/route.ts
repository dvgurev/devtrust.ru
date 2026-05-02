import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"
import { z } from "zod"

const updateExternalAppSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  externalUrl: z.string().url().optional().nullable(),
  customDomain: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "MAINTENANCE", "HIDDEN", "DRAFT"]).optional(),
  allowedDomains: z.array(z.string()).optional(),
  ssoEnabled: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const app = await prisma.app.findUnique({
      where: { id, isExternal: true },
      include: {
        externalConfig: true,
        category: true,
        plans: true,
      },
    })

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    return NextResponse.json(app)
  } catch (error) {
    console.error("Get external app error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateExternalAppSchema.parse(body)

    const app = await prisma.app.findUnique({
      where: { id, isExternal: true },
      include: { externalConfig: true },
    })

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    const updatedApp = await prisma.app.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        externalUrl: data.externalUrl,
        customDomain: data.customDomain,
        status: data.status,
        externalConfig: data.allowedDomains || data.ssoEnabled !== undefined
          ? {
              update: {
                allowedDomains: data.allowedDomains,
                ssoEnabled: data.ssoEnabled,
              },
            }
          : undefined,
      },
      include: {
        externalConfig: true,
      },
    })

    return NextResponse.json(updatedApp)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Update external app error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const app = await prisma.app.findUnique({
      where: { id, isExternal: true },
    })

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    await prisma.app.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete external app error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}