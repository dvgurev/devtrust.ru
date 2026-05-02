import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Mail, Phone, Lock, Save, Check, Shield, Key, Sparkles, Zap } from "lucide-react"

export default async function DashboardProfilePage() {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  async function updateProfile(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string

    await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    })
  }

  async function changePassword(formData: FormData) {
    "use server"
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    if (!currentPassword || !newPassword) {
      return
    }

    if (newPassword.length < 8) {
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.password) {
      return
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50" />
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-amber-500 rounded-full text-sm font-medium mb-4 shadow-sm">
                  <User className="w-4 h-4" />
                  Личный кабинет
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Профиль
                </h1>
                <p className="text-lg text-slate-600">Управление личными данными и безопасностью</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user?.name || "Пользователь"}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl text-slate-900">Личные данные</h2>
                    <p className="text-slate-500">Основная информация о вас</p>
                  </div>
                </div>
                
                <form action={updateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Имя</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        name="name"
                        defaultValue={user?.name || ""}
                        placeholder="Ваше имя"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        value={user?.email || ""}
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100/60 border border-slate-200/40 rounded-xl text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        name="phone"
                        defaultValue={user?.phone || ""}
                        placeholder="+7 (999) 123-45-67"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Сохранить изменения
                  </button>
                </form>
              </div>

              {/* Password Change */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl text-slate-900">Безопасность</h2>
                    <p className="text-slate-500">Смена пароля и защита аккаунта</p>
                  </div>
                </div>
                
                <form action={changePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Текущий пароль</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        name="currentPassword"
                        type="password"
                        placeholder="Введите текущий пароль"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Новый пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="Минимум 8 символов"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      <p className="text-sm font-medium text-amber-700">Рекомендации по безопасности</p>
                    </div>
                    <p className="text-sm text-amber-600">
                      Пароль должен содержать минимум 8 символов, включая цифры и специальные символы.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50/60 hover:border-slate-300 transition-all"
                  >
                    Изменить пароль
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">Активен</div>
                    <div className="text-sm text-slate-500">Статус аккаунта</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru") : "—"}
                    </div>
                    <div className="text-sm text-slate-500">Дата регистрации</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">2FA</div>
                    <div className="text-sm text-slate-500">Двухфакторная аутентификация</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="mt-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-xl">Защитите свой аккаунт</h3>
                  </div>
                  <p className="text-amber-100 text-lg max-w-2xl">
                    Включите двухфакторную аутентификацию и регулярно обновляйте пароль для максимальной безопасности.
                  </p>
                </div>
                <Link
                  href="/dashboard/profile#security"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Настроить безопасность
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}