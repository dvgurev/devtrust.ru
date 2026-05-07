import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Mail, Phone, Lock, Save, Shield, Key, Sparkles, Check, Calendar } from "lucide-react"

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

    if (!currentPassword || !newPassword) return
    if (newPassword.length < 8) return

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.password) return

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Профиль
          </h1>
          <p className="text-neutral-500 mt-1">
            Управление личными данными и безопасностью
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <p className="font-bold text-neutral-900">{user?.name || "Пользователь"}</p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-lg font-black text-neutral-900">Активен</div>
              <div className="text-xs text-neutral-400">Статус</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <div className="text-lg font-black text-neutral-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru") : "—"}
              </div>
              <div className="text-xs text-neutral-400">Регистрация</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-black text-neutral-900">Базовая</div>
              <div className="text-xs text-neutral-400">Защита</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Личные данные</h2>
              <p className="text-sm text-neutral-500">Основная информация</p>
            </div>
          </div>

          <form action={updateProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Имя</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="name"
                  defaultValue={user?.name || ""}
                  placeholder="Ваше имя"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-neutral-100 border border-neutral-200 rounded-2xl
                    text-neutral-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">Email нельзя изменить</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Телефон</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="phone"
                  defaultValue={user?.phone || ""}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 
                bg-neutral-900 text-white rounded-2xl font-bold text-sm
                hover:bg-neutral-800 transition-all duration-300"
            >
              <Save className="w-4 h-4" />
              Сохранить изменения
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Безопасность</h2>
              <p className="text-sm text-neutral-500">Смена пароля</p>
            </div>
          </div>

          <form action={changePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Текущий пароль</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Введите текущий пароль"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                    transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Новый пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="newPassword"
                  type="password"
                  placeholder="Минимум 8 символов"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl
                    text-neutral-900 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                    transition-all duration-300"
                />
              </div>
            </div>

            {/* Security Tip */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-1">Рекомендации</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Пароль должен содержать минимум 8 символов, включая цифры и специальные символы.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 
                border-2 border-neutral-200 text-neutral-700 rounded-2xl font-bold text-sm
                hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300"
            >
              Изменить пароль
            </button>
          </form>
        </div>
      </div>

      {/* Help */}
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h3 className="font-bold text-violet-900">Защитите свой аккаунт</h3>
            </div>
            <p className="text-violet-700 text-sm max-w-lg">
              Включите двухфакторную аутентификацию для максимальной безопасности вашего аккаунта.
            </p>
          </div>
          <Link
            href="/docs/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white 
              rounded-full font-bold text-sm hover:bg-violet-700 transition-all duration-300
              flex-shrink-0"
          >
            <Shield className="w-4 h-4" />
            Настроить 2FA
          </Link>
        </div>
      </div>
    </div>
  )
}