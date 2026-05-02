"use client"

import Link from "next/link"
import { ArrowRight, Star, Check, Sparkles, Package, Wallet, Zap, Shield, ChevronRight, Play, Quote, TrendingUp, Users } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const features = [
  { icon: Package, title: "Все приложения в одном месте", description: "CRM, документы, аналитика — единый интерфейс", bg: "bg-red-50", text: "text-red-600" },
  { icon: Wallet, title: "Платите за использование", description: "Тарифы зависят от количества пользователей", bg: "bg-violet-50", text: "text-violet-600" },
  { icon: Zap, title: "Мгновенный старт", description: "Доступ сразу после оплаты", bg: "bg-amber-50", text: "text-amber-600" },
  { icon: Shield, title: "Данные в РФ", description: "Безопасность и соответствие стандартам", bg: "bg-emerald-50", text: "text-emerald-600" },
]

const stats = [
  { value: "500+", label: "компаний", icon: Users },
  { value: "50+", label: "приложений", icon: Package },
  { value: "10K+", label: "пользователей", icon: TrendingUp },
  { value: "99.9%", label: "uptime", icon: Shield },
]

const testimonials = [
  { name: "Алексей Петров", role: "Директор ООО ТехноСтрой", text: "Взяли CRM и документы. Всё работает мгновенно, никакой головной боли с настройкой.", avatar: "А", bg: "bg-red-500" },
  { name: "Мария Сидорова", role: "Founder StartUp Studio", text: "Отличная платформа! Команда растёт, все в одном месте. Поддержка реально 24/7.", avatar: "М", bg: "bg-violet-500" },
  { name: "Иван Иванов", role: "ИП", text: "Как ИП мне важно было просто начать. Всё интуитивно, оплата за пользователей — честно.", avatar: "И", bg: "bg-emerald-500" },
]

const steps = [
  { step: "01", title: "Выберите", description: "Найдите нужные инструменты в каталоге", icon: Package },
  { step: "02", title: "Оформите", description: "Оплатите подписку на приложение", icon: Wallet },
  { step: "03", title: "Начните", description: "Пользуйтесь сразу после оплаты", icon: Zap },
]

interface HomeClientProps {
  featuredApps: any[]
  categories: any[]
}

export default function HomeClient({ featuredApps, categories }: HomeClientProps) {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50" />
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Магазин бизнес-приложений
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              Бизнес-приложения
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                в одной подписке
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
            >
              CRM, документы, аналитика и коммуникации. Платите только за активных пользователей.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-red-500/25 transition-all text-lg"
              >
                Выбрать приложения
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-xl border border-white/40 text-slate-900 font-semibold rounded-2xl hover:bg-white/80 transition-all text-lg"
              >
                <Play className="w-5 h-5" />
                Бесплатный старт
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 justify-center text-sm text-slate-500"
            >
              {["Мгновенный доступ", "Отмена в любое время", "Поддержка 24/7"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{t}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Glass Card */}
      <section className="relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <s.icon className="w-5 h-5 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 mt-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Категории</h2>
                <p className="text-slate-500 mt-2">Выберите инструменты для своего бизнеса</p>
              </div>
              <Link href="/catalog" className="text-red-400 font-medium hover:underline flex items-center gap-1">
                Все категории <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: any, i: number) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/catalog?category=${cat.slug}`}>
                    <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl text-center hover:border-red-300/50 hover:shadow-lg hover:shadow-red-500/5 transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-all">
                        <Package className="w-7 h-7 text-red-400" />
                      </div>
                      <div className="font-semibold text-slate-900 mb-1">{cat.name}</div>
                      <div className="text-sm text-slate-400">{cat._count.apps} приложений</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Apps */}
      {featuredApps.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Популярные приложения</h2>
                <p className="text-slate-500 mt-2">Инструменты с лучшим рейтингом</p>
              </div>
              <Link href="/catalog" className="text-red-400 font-medium hover:underline flex items-center gap-1">
                Весь каталог <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredApps.map((app: any, i: number) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link href={`/apps/${app.slug}`}>
                    <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl hover:border-red-300/50 hover:shadow-xl hover:shadow-red-500/5 transition-all h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="w-7 h-7" />
                          ) : (
                            <span className="text-white font-bold text-lg">{app.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-red-500 transition-colors">{app.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm text-slate-600">{app.averageRating?.toFixed(1) || "0.0"}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{app.description}</p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{app.category?.name}</span>
                        <span className="text-sm font-semibold text-red-500">
                          {app.isFree ? "Бесплатно" : `от ${app.plans?.[0]?.price || 0} ₽`}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Как это работает</h2>
            <p className="text-slate-600 max-w-lg mx-auto">Три простых шага — и ваш бизнес работает с лучшими инструментами</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-2xl text-center hover:border-red-300/50 transition-all">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/25">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 mt-4">
                    <step.icon className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Почему DevTrust</h2>
            <p className="text-slate-600 max-w-lg mx-auto">Всё необходимое для управления бизнес-приложениями</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl hover:border-red-300/50 hover:shadow-lg transition-all"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5", f.bg)}>
                  <f.icon className={cn("w-7 h-7", f.text)} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Отзывы клиентов</h2>
            <p className="text-slate-500">Мнение пользователей о платформе</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl"
              >
                <Quote className="w-10 h-10 text-red-200 mb-4" />
                <p className="text-slate-700 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg", t.bg)}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-orange-400" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Готовы автоматизировать бизнес?</h2>
            <p className="text-white/80 text-lg mb-8">Зарегистрируйтесь и получите доступ к профессиональным инструментам</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-500 font-semibold rounded-2xl hover:shadow-xl transition-all text-lg"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all text-lg"
              >
                Посмотреть каталог
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
