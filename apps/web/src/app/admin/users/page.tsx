// apps/web/src/app/admin/users/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
  Users, Mail, Calendar, Building, CheckCircle,
  ArrowUpRight, Shield
} from "lucide-react"
import { DeleteUserButton } from "@/components/delete-user-button"
import { ToggleUserRoleButton } from "@/components/toggle-user-role-button"

type UserType = {
  id: string
  email: string
  name: string | null
  createdAt: Date
  isVerified: boolean
  role: string
  phone: string | null
  memberships: { organization: { name: string } | null }[]
}

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({
    include: {
      memberships: {
        include: { organization: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  }) as UserType[]

  async function toggleUserRole(userId: string, currentRole: string) {
    "use server"
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
    revalidatePath("/admin/users")
  }

  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    today: users.filter(u => {
      const today = new Date()
      return new Date(u.createdAt).toDateString() === today.toDateString()
    }).length,
    withOrg: users.filter(u => u.memberships.length > 0).length,
    admins: users.filter(u => u.role === "ADMIN").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Пользователи
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление аккаунтами пользователей
          </p>
        </div>
        <Link
          href="/admin/organizations"
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
            rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
        >
          <Building className="w-4 h-4" />
          Организации
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Всего", value: stats.total, icon: Users, color: "neutral" },
          { label: "Верифицировано", value: stats.verified, icon: CheckCircle, color: "emerald" },
          { label: "Сегодня", value: stats.today, icon: Users, color: "amber" },
          { label: "В организациях", value: stats.withOrg, icon: Building, color: "blue" },
          { label: "Админов", value: stats.admins, icon: Shield, color: "violet" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-6">
            <stat.icon className={`w-5 h-5 ${stat.color === "neutral" ? "text-neutral-400" : `text-${stat.color}-500`
              } mb-3`} />
            <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Статус
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Роль
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Дата
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 truncate max-w-[180px]">
                          {user.name || "Без имени"}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-neutral-400">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-sm text-neutral-500 truncate max-w-[200px]">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    <div className="flex justify-center">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 
                          bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Верифицирован
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 
                          bg-amber-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          Не проверен
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">
                    <div className="flex justify-center">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 
                          rounded-full text-xs font-bold">
                          <Shield className="w-3 h-3" />
                          Админ
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-500">Пользователь</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString("ru")}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-1">
                      {user.id !== session.user.id && (
                        <>
                          <ToggleUserRoleButton
                            userId={user.id}
                            currentRole={user.role}
                          />
                          <DeleteUserButton
                            userId={user.id}
                            userName={user.name || user.email}
                          />
                        </>
                      )}
                      {user.id === session.user.id && (
                        <span className="text-xs text-neutral-400 pr-2">Это вы</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет пользователей</h3>
            <p className="text-neutral-500">Пользователи появятся после регистрации</p>
          </div>
        )}
      </div>
    </div>
  )
}