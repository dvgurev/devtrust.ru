import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { OrganizationsClient } from "@/components/admin-organizations-client"

type OrganizationType = {
  id: string
  name: string
  slug: string
  inn: string | null
  createdAt: Date
  memberships: { id: string }[]
}

export default async function AdminOrganizationsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.email === "admin@devtrust.ru"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  const organizations = await prisma.organization.findMany({
    include: {
      memberships: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return <OrganizationsClient organizations={organizations as OrganizationType[]} />
}