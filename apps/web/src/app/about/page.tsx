"use client"

import { Sparkles, Users, Shield, HeadphonesIcon, Check, ArrowRight, Package, Wallet, Zap, TrendingUp, Globe, Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

const values = [
  { icon: Shield, title: "Безопасность", description: "Ваши данные защищены. Мы соответствуем требованиям законодательства РФ и используем современные технологии защиты.", bg: "bg-red-50", text: "text-red-600" },
  { icon: Users, title: "Простота", description: "Интуитивный интерфейс и мгновенная активация. Начните работать за 5 минут после регистрации.", bg: "bg-violet-50", text: "text-violet-600" },
  { icon: HeadphonesIcon, title: "Поддержка", description: "Техническая поддержка доступна круглосуточно. Мы всегда готовы помочь в решении любых вопросов.", bg: "bg-amber-50", text: "text-amber-600" },
  { icon: Globe, title: "Доступность", description: "Работаем по всей России. Локализованные решения и поддержка на русском языке.", bg: "bg-emerald-50", text: "text-emerald-600" },
  { icon: TrendingUp, title: "Развитие", description: "Постоянно добавляем новые приложения и улучшаем платформу на основе ваших отзывов.", bg: "bg-blue-50", text: "text-blue-600" },
  { icon: Heart, title: "Забота", description: "Ставим интересы клиентов на первое место. Честные тарифы и прозрачные условия.", bg: "bg-pink-50", text: "text-pink-600" },
]

const stats = [
  { value: "500+", label: "компаний", icon: Users },
  { value: "50+", label: "приложений", icon: Package },
  { value: "10K+", label: "пользователей", icon: TrendingUp },
  { value: "99.9%", label: "uptime", icon: Shield },
]

const benefits = [
  "Бесплатные приложения для старта",
  "Без скрытых комиссий и платежей",
  "Отмена подписки в любое время",
  "Командный доступ для сотрудников",
  "Регулярные обновления и новые функции",
  "Данные хранятся в РФ",
]

export default function AboutPage() {
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
              О платформе DevTrust
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              Мы создаём
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                будущее бизнеса
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
            >
              DevTrust — это платформа, которая упрощает доступ к профессиональным бизнес-инструментам. 
              Мы объединяем лучшие приложения в одном месте, чтобы вы могли сосредоточиться на развитии 
              своего бизнеса.
            </motion.p>
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

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Наша миссия</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Мы верим, что технологии должны быть доступными, простыми и безопасными. 
                Наша цель — изменить способ, которым компании используют бизнес-приложения.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Платите только за то, чем пользуетесь. Добавляйте сотрудников в один клик. 
                Получайте поддержку 24/7. Мы делаем бизнес-технологии доступными для всех — 
                от стартапов до крупных предприятий.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all"
              >
                Открыть каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl shadow-black/5 p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Наши принципы</h3>
              <div className="grid grid-cols-2 gap-4">
                {values.slice(0, 4).map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`${value.bg} p-4 rounded-2xl`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${value.text} bg-white/60`}>
                        <value.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-900">{value.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Что нас отличает</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Мы строим платформу, которая действительно работает на ваш бизнес
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${value.bg} p-6 rounded-3xl border border-white/30 backdrop-blur-sm`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${value.text} bg-white/60`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-slate-600">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Почему выбирают нас</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {benefits.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:shadow-xl transition-all"
                  >
                    Начать бесплатно
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 text-red-500 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Свяжитесь с нами
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Есть вопросы?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Мы всегда рады помочь! Наша команда поддержки готова ответить на любые вопросы.
            </p>
            <a
              href="mailto:support@devtrust.ru"
              className="inline-flex items-center gap-2 text-red-600 font-semibold text-lg hover:underline"
            >
              support@devtrust.ru
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}