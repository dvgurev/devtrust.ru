import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(null)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  })

  const primaryMembership = user?.memberships?.[0]
  const organization = primaryMembership?.organization

  if (!organization) {
    return NextResponse.json(null)
  }

  return NextResponse.json({
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
  })
}