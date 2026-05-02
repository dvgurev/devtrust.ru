import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ organizations: [] })
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  const organizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
  }))

  return NextResponse.json({ organizations })
}