"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Search, Filter, Users, Calendar, ArrowRight, Plus, TrendingUp, Zap, Shield, Globe, MoreVertical, Edit, Trash2, Eye } from "lucide-react"

type OrganizationType = {
  id: string
  name: string
  slug: string
  inn: string | null
  createdAt: Date
  memberships: { id: string }[]
}

export function OrganizationsClient({ organizations }: { organizations: OrganizationType[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.inn && org.inn.includes(searchTerm))
  )

  const stats = {
    total: organizations.length,
    withInn: organizations.filter(o => o.inn).length,
    active: organizations.filter(o => o.memberships.length > 0).length,
    totalUsers: organizations.reduce((sum, o) => sum + o.memberships.length, 0),
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-violet-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-purple-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Building2 className="w-4 h-4" />
                  Управление организациями
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Организации
                </h1>
                <p className="text-lg text-slate-600">Управление компаниями и их участниками</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Пользователи
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all">
                  <Plus className="w-5 h-5" />
                  Добавить организацию
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative -mt-6 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-all">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500 mt-1">Организаций</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Активные
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
                  <div className="text-sm text-slate-500 mt-1">С пользователями</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-all">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    С ИНН
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.withInn}</div>
                  <div className="text-sm text-slate-500 mt-1">Верифицировано</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
                  <div className="text-sm text-slate-500 mt-1">Участников</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Поиск по названию, slug или ИНН..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 text-purple-700 text-sm font-medium rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Фильтры
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Экспорт
                  </button>
                </div>
              </div>
            </div>

            {/* Organizations Table */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/30">
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Организация</th>
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">ИНН</th>
                      <th className="text-center py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Участники</th>
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Создана</th>
                      <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {filteredOrgs.map((org) => (
                      <tr key={org.id} className="group hover:bg-white/40 transition-all duration-200">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-violet-200 transition-all flex-shrink-0">
                              <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors truncate max-w-[200px]">
                                {org.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                /{org.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {org.inn ? (
                            <span className="text-sm font-mono text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg">
                              {org.inn}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Не указан</span>
                          )}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900">{org.memberships.length}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {new Date(org.createdAt).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/organizations/${org.id}`}
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                              title="Просмотреть"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/organizations/${org.id}/edit`}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Редактировать"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrgs.length === 0 && organizations.length > 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Ничего не найдено по запросу "{searchTerm}"</p>
                </div>
              )}

              {organizations.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6">
                    <Building2 className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Нет организаций</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                    Организации появятся после создания их пользователями
                  </p>
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all">
                    <Plus className="w-5 h-5" />
                    Добавить организацию
                  </button>
                </div>
              )}

              {/* Pagination */}
              {organizations.length > 0 && (
                <div className="border-t border-white/30 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      Показано <span className="font-medium text-slate-900">1-{Math.min(filteredOrgs.length, 20)}</span> из{" "}
                      <span className="font-medium text-slate-900">{filteredOrgs.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        Назад
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-lg">
                        1
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        2
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        Вперед
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Управление организациями</h3>
                </div>
                <p className="text-purple-100 text-lg mb-6">
                  Просматривайте и редактируйте данные организаций, управляйте участниками и подписками.
                </p>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Users className="w-5 h-5" />
                  Управление пользователями
                </Link>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-900">Быстрые ссылки</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/subscriptions"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group"
                  >
                    <span>Подписки организаций</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group"
                  >
                    <span>Аналитика по компаниям</span>
                    <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/audit"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group"
                  >
                    <span>Журнал действий</span>
                    <Shield className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}