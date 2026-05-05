import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    return { ok: false as const, status: 401 as const }
  }

  if ((session.user.role ?? "USER") !== "ADMIN") {
    return { ok: false as const, status: 403 as const }
  }

  return { ok: true as const, session }
}
