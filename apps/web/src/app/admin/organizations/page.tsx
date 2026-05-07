// apps/web/src/app/admin/organizations/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Building2, Users, Search, ArrowUpRight, Eye,
  Plus, Sparkles
} from "lucide-react"

type OrganizationType = {
  id: string
  name: string
  slug: string
  inn: string | null
  createdAt: Date
  _count: { memberships: number }
  memberships: { id: string }[]
}

export default async function AdminOrganizationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const organizations = await prisma.organization.findMany({
    include: {
      _count: { select: { memberships: true } },
      memberships: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  }) as unknown as OrganizationType[]

  const stats = {
    total: organizations.length,
    totalUsers: organizations.reduce((sum, org) => sum + org._count.memberships, 0),
    withINN: organizations.filter(org => org.inn).length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Организации
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление организациями платформы
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Создать
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <Building2 className="w-5 h-5 text-violet-500 mb-3" />
          <div className="text-2xl font-black text-neutral-900">{stats.total}</div>
          <div className="text-sm text-neutral-400">Организаций</div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <Users className="w-5 h-5 text-emerald-500 mb-3" />
          <div className="text-2xl font-black text-neutral-900">{stats.totalUsers}</div>
          <div className="text-sm text-neutral-400">Пользователей</div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <Sparkles className="w-5 h-5 text-amber-500 mb-3" />
          <div className="text-2xl font-black text-neutral-900">{stats.withINN}</div>
          <div className="text-sm text-neutral-400">С ИНН</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Поиск по названию или ИНН..."
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
              text-neutral-900 placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
              transition-all duration-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Организация
                </th>
                <th className="text-left py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  ИНН
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Пользователей
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Создана
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                          {org.name}
                        </p>
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                          {org.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <span className="text-sm text-neutral-500 font-mono">
                      {org.inn || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-900">
                        {org._count.memberships}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">
                    <span className="text-sm text-neutral-500">
                      {new Date(org.createdAt).toLocaleDateString("ru")}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="p-2 text-neutral-400 hover:text-violet-600 hover:bg-violet-50 
                          rounded-lg transition-all"
                        title="Просмотреть"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {organizations.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Нет организаций</h3>
            <p className="text-neutral-500">Организации появятся после регистрации пользователей</p>
          </div>
        )}
      </div>
    </div>
  )
}