const BASE_URL = typeof window !== "undefined" ? "" : (process.env.PLATFORM_URL || "https://devtrust.ru")

export interface SSOUser {
  id: string
  email: string
  name?: string
  image?: string
}

export interface SSOOrganization {
  id: string
  name: string
  slug: string
}

export interface SSOSession {
  user: SSOUser
  organization: SSOOrganization
  accessToken: string
  expiresAt: number
}

export async function getCurrentSession(): Promise<SSOSession | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/internal/me`, {
      credentials: "include",
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function verifyToken(token: string): Promise<SSOSession | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/sso/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function refreshToken(refreshToken: string): Promise<SSOSession | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/sso/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export function getSSOLoginUrl(appSlug: string, redirectUrl?: string): string {
  const params = new URLSearchParams({
    app: appSlug,
  })
  if (redirectUrl) {
    params.set("redirect", redirectUrl)
  }
  return `${BASE_URL}/sso/login?${params.toString()}`
}

export function getSSOLogoutUrl(): string {
  return `${BASE_URL}/sso/logout`
}

export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sso_token="))
    ?.split("=")[1]
  return token ? { Authorization: `Bearer ${token}` } : {}
}