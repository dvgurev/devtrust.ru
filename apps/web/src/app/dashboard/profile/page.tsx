// apps/web/src/app/dashboard/profile/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Mail, Phone, Lock, Save, Shield, Key, Sparkles, Check, Calendar } from "lucide-react"

export default async function DashboardProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const user = await prisma.user.findUnique({ where: { id: userId } })

  async function updateProfile(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    await prisma.user.update({ where: { id: userId }, data: { name, phone } })
  }

  async function changePassword(formData: FormData) {
    "use server"
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    if (!currentPassword || !newPassword || newPassword.length < 8) return
    const u = await prisma.user.findUnique({ where: { id: userId } })
    if (!u?.password) return
    const isValid = await bcrypt.compare(currentPassword, u.password)
    if (!isValid) return
    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm lg:text-base">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">Профиль</h1>
          <p className="text-neutral-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: "Статус", value: "Активен", icon: Check, color: "emerald" },
          { label: "Регистрация", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru") : "—", icon: Calendar, color: "violet" },
          { label: "Защита", value: "Базовая", icon: Shield, color: "blue" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-3 lg:p-6">
            <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 text-${stat.color}-500 mb-1.5 lg:mb-3`} />
            <div className="text-sm lg:text-lg font-black text-neutral-900">{stat.value}</div>
            <div className="text-[10px] lg:text-xs text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Forms */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
          <h2 className="font-bold text-neutral-900 text-sm lg:text-lg mb-4">Личные данные</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-bold text-neutral-700 mb-1.5">Имя</label>
              <input name="name" defaultValue={user?.name || ""} placeholder="Ваше имя"
                className="w-full px-4 py-2.5 lg:py-3 bg-neutral-50 border border-neutral-200 rounded-xl lg:rounded-2xl
                  text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-xs lg:text-sm font-bold text-neutral-700 mb-1.5">Email</label>
              <input value={user?.email || ""} disabled
                className="w-full px-4 py-2.5 lg:py-3 bg-neutral-100 border border-neutral-200 rounded-xl lg:rounded-2xl
                  text-sm text-neutral-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs lg:text-sm font-bold text-neutral-700 mb-1.5">Телефон</label>
              <input name="phone" defaultValue={user?.phone || ""} placeholder="+7 (999) 123-45-67"
                className="w-full px-4 py-2.5 lg:py-3 bg-neutral-50 border border-neutral-200 rounded-xl lg:rounded-2xl
                  text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3.5 
                bg-neutral-900 text-white rounded-xl lg:rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all">
              <Save className="w-4 h-4" /> Сохранить
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
          <h2 className="font-bold text-neutral-900 text-sm lg:text-lg mb-4">Безопасность</h2>
          <form action={changePassword} className="space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-bold text-neutral-700 mb-1.5">Текущий пароль</label>
              <input name="currentPassword" type="password" placeholder="Введите пароль"
                className="w-full px-4 py-2.5 lg:py-3 bg-neutral-50 border border-neutral-200 rounded-xl lg:rounded-2xl
                  text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="block text-xs lg:text-sm font-bold text-neutral-700 mb-1.5">Новый пароль</label>
              <input name="newPassword" type="password" placeholder="Минимум 8 символов"
                className="w-full px-4 py-2.5 lg:py-3 bg-neutral-50 border border-neutral-200 rounded-xl lg:rounded-2xl
                  text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div className="bg-amber-50 rounded-xl lg:rounded-2xl p-3 border border-amber-100">
              <p className="text-xs text-amber-700">Пароль: минимум 8 символов, цифры и спецсимволы.</p>
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3.5 
                border-2 border-neutral-200 text-neutral-700 rounded-xl lg:rounded-2xl font-bold text-sm
                hover:bg-neutral-50 transition-all">
              Изменить пароль
            </button>
          </form>
        </div>
      </div>

      {/* 2FA */}
      <div className="mt-4 lg:mt-6 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" />
              <h3 className="font-bold text-violet-900 text-sm lg:text-base">Двухфакторная аутентификация</h3>
            </div>
            <p className="text-violet-700 text-xs lg:text-sm">Защитите аккаунт с помощью 2FA</p>
          </div>
          <Link href="/docs/contact"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 lg:px-5 lg:py-2.5 
              bg-violet-600 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-violet-700 transition-all flex-shrink-0">
            <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Настроить
          </Link>
        </div>
      </div>
    </div>
  )
}