import { prisma } from "@/lib/prisma"

type AuditAction = 
  | "user.login"
  | "user.register"
  | "user.logout"
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "organization.created"
  | "organization.updated"
  | "member.invited"
  | "member.removed"
  | "app.created"
  | "app.updated"
  | "app.deleted"
  | "post.created"
  | "post.published"
  | "post.deleted"
  | "review.created"
  | "review.moderated"
  | "promo.created"
  | "promo.used"

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  oldValue,
  newValue,
  ip,
}: {
  userId?: string
  action: AuditAction
  entityType?: string
  entityId?: string
  oldValue?: any
  newValue?: any
  ip?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? undefined,
        action,
        entityType: entityType ?? undefined,
        entityId: entityId ?? undefined,
        oldValue: oldValue ?? undefined,
        newValue: newValue ?? undefined,
        ip: ip ?? undefined,
      },
    })
  } catch (error) {
    console.error("Audit log error:", error)
  }
}