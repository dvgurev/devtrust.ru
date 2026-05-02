export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
}

export interface AppAccess {
  id: string
  subscriptionId: string
  userId: string
}

export interface Subscription {
  id: string
  organizationId: string
  planId: string
  status: "ACTIVE" | "CANCELED" | "EXPIRED" | "PAST_DUE"
  currentPeriodEnd: Date
}

export interface AppInfo {
  id: string
  name: string
  slug: string
  subdomain?: string
  externalUrl?: string
  iconUrl?: string
}

export interface ExternalAppConfig {
  appId: string
  appSlug: string
  name: string
  allowedDomains: string[]
  ssoEnabled: boolean
  apiSecret: string
}