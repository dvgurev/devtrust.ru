import type { User, Organization, AppInfo } from "./types"

const BASE_URL = typeof window !== "undefined" ? "" : (process.env.PLATFORM_URL || "https://devtrust.ru")

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export async function checkAccess(appId: string): Promise<{ allowed: boolean }> {
  return fetchApi<{ allowed: boolean }>("/api/internal/check-access", {
    method: "POST",
    body: JSON.stringify({ appId }),
  })
}

export async function checkExternalAccess(appSlug: string): Promise<{ allowed: boolean; app?: AppInfo }> {
  return fetchApi<{ allowed: boolean; app?: AppInfo }>(`/api/external/${appSlug}/access`)
}

export async function getCurrentUser(): Promise<User | null> {
  return fetchApi<User | null>("/api/internal/me")
}

export async function getOrganization(): Promise<Organization | null> {
  return fetchApi<Organization | null>("/api/internal/organization")
}

export async function sendUsage(appId: string, metrics: Record<string, number>): Promise<void> {
  await fetchApi<void>("/api/internal/usage", {
    method: "POST",
    body: JSON.stringify({ appId, metrics }),
  })
}

export function getAppUrl(appSlug: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}`
  }
  return `https://${appSlug}.devtrust.ru`
}