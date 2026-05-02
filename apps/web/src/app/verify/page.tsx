import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return redirect("/login?error=invalid_token")
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationExpires: { gt: new Date() },
    },
  })

  if (!user) {
    return redirect("/login?error=invalid_token")
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  })

  return redirect("/dashboard?verified=1")
}