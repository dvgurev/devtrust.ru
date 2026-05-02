import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, Mail, Calendar, Building, Search, Shield, Plus, Pencil, Trash2, Filter, Download, MoreVertical, CheckCircle, XCircle, Clock, TrendingUp, UserPlus, Sparkles, Zap, ArrowRight, Phone, Globe } from "lucide-react"

type UserType = {
  id: string
  email: string
  name: string | null
  createdAt: Date
  isVerified: boolean
  phone: string | null
  memberships: { organization: { name: string } | null }[]
}

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const isAdmin = session.user.email === "admin@devtrust.ru"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    include: {
      memberships: {
        include: { organization: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  }) as UserType[]

  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    today: users.filter(u => {
      const today = new Date()
      const userDate = new Date(u.createdAt)
      return userDate.toDateString() === today.toDateString()
    }).length,
    withOrg: users.filter(u => u.memberships.length > 0).length,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-purple-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-violet-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <Users className="w-4 h-4" />
                  Управление пользователями
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Пользователи платформы
                </h1>
                <p className="text-lg text-slate-600">Управление аккаунтами, верификация и контроль доступа</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/organizations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                >
                  <Building className="w-4 h-4" />
                  Организации
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-violet-500/25 transition-all">
                  <UserPlus className="w-5 h-5" />
                  Добавить пользователя
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
                  <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Всего
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500 mt-1">Зарегистрировано</div>
                  <div className="text-xs text-slate-400 mt-2">На платформе</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-all">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Верификация
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.verified}</div>
                  <div className="text-sm text-slate-500 mt-1">Подтверждено</div>
                  <div className="text-xs text-slate-400 mt-2">{Math.round((stats.verified / stats.total) * 100)}% от всех</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-all">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Сегодня
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
                  <div className="text-sm text-slate-500 mt-1">Новых</div>
                  <div className="text-xs text-slate-400 mt-2">За последние 24 часа</div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-white/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-all">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    В компаниях
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900">{stats.withOrg}</div>
                  <div className="text-sm text-slate-500 mt-1">В организациях</div>
                  <div className="text-xs text-slate-400 mt-2">{Math.round((stats.withOrg / stats.total) * 100)}% пользователей</div>
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
            {/* Filters and Search */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Поиск по email, имени или телефону..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 text-violet-700 text-sm font-medium rounded-xl hover:from-violet-100 hover:to-purple-100 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Фильтры
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all">
                    <Shield className="w-3.5 h-3.5" />
                    Роли
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Экспорт
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/30">
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Пользователь</th>
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Контакты</th>
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Организации</th>
                      <th className="text-center py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Статус</th>
                      <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Дата регистрации</th>
                      <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/20">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {users.map((user) => (
                      <tr key={user.id} className="group hover:bg-white/40 transition-all duration-200">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 transition-colors truncate max-w-[180px]">
                                {user.name || "Без имени"}
                              </div>
                              <div className="text-xs text-slate-400 truncate max-w-[180px]">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="text-sm text-slate-600 truncate max-w-[200px]">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="text-sm text-slate-600">{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {user.memberships.length > 0 ? (
                            <div className="space-y-1">
                              {user.memberships.slice(0, 2).map((membership, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <span className="text-sm text-slate-700 truncate max-w-[160px]">
                                    {membership.organization?.name || "Без названия"}
                                  </span>
                                </div>
                              ))}
                              {user.memberships.length > 2 && (
                                <div className="text-xs text-violet-600 font-medium">
                                  +{user.memberships.length - 2} ещё
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Нет организаций</span>
                          )}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex justify-center">
                            {user.isVerified ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Верифицирован
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Не верифицирован
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {new Date(user.createdAt).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs text-slate-500">
                                {new Date(user.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                              title="Редактировать"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-1.5 rounded-lg transition-all ${
                                user.isVerified
                                  ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={user.isVerified ? "Снять верификацию" : "Верифицировать"}
                            >
                              {user.isVerified ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                              title="Ещё"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {users.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Нет пользователей</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                    Пользователи появятся после регистрации на платформе
                  </p>
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-violet-500/25 transition-all">
                    <UserPlus className="w-5 h-5" />
                    Пригласить пользователей
                  </button>
                </div>
              )}

              {/* Pagination */}
              {users.length > 0 && (
                <div className="border-t border-white/30 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      Показано <span className="font-medium text-slate-900">1-{Math.min(users.length, 20)}</span> из{" "}
                      <span className="font-medium text-slate-900">{users.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        Назад
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-lg">
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

            {/* Bottom Actions */}
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Аналитика пользователей</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold">+{stats.today}</div>
                      <div className="text-violet-200 text-sm">Новых сегодня</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round((stats.verified / stats.total) * 100)}%</div>
                      <div className="text-violet-200 text-sm">Верифицировано</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round((stats.withOrg / stats.total) * 100)}%</div>
                      <div className="text-violet-200 text-sm">В организациях</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">24ч</div>
                      <div className="text-violet-200 text-sm">Активность</div>
                    </div>
                  </div>
                  <Link
                    href="/admin/analytics"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Подробная аналитика
                  </Link>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <Shield className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-900">Быстрые действия</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/organizations"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors group"
                  >
                    <span>Управление организациями</span>
                    <Building className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/audit"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors group"
                  >
                    <span>Журнал действий</span>
                    <Clock className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors group"
                  >
                    <span>Настройки безопасности</span>
                    <Shield className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/admin/reviews"
                    className="flex items-center justify-between p-3 text-sm text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors group"
                  >
                    <span>Модерация отзывов</span>
                    <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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