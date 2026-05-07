"use client"

import {
  Sparkles, Users, Shield, HeadphonesIcon, Globe, Heart,
  ArrowRight, Check, TrendingUp, Zap, ArrowUpRight, Star,
  Coffee, Target, Rocket
} from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

const values = [
  {
    title: "Безопасность",
    description: "Ваши данные защищены. Мы соответствуем требованиям законодательства РФ.",
    icon: Shield,
    color: "emerald"
  },
  {
    title: "Простота",
    description: "Интуитивный интерфейс и мгновенная активация. Начните работать за 5 минут.",
    icon: Rocket,
    color: "violet"
  },
  {
    title: "Поддержка",
    description: "Техподдержка 24/7. Мы всегда готовы помочь в решении любых вопросов.",
    icon: HeadphonesIcon,
    color: "blue"
  },
  {
    title: "Доступность",
    description: "Работаем по всей России. Локализованные решения на русском языке.",
    icon: Globe,
    color: "amber"
  },
  {
    title: "Развитие",
    description: "Постоянно добавляем новые приложения и улучшаем платформу.",
    icon: TrendingUp,
    color: "rose"
  },
  {
    title: "Забота",
    description: "Честные тарифы и прозрачные условия. Интересы клиентов на первом месте.",
    icon: Heart,
    color: "pink"
  },
]

const stats = [
  { value: "500+", label: "компаний", icon: Users },
  { value: "50+", label: "приложений", icon: Zap },
  { value: "10K+", label: "пользователей", icon: Star },
  { value: "99.9%", label: "uptime", icon: TrendingUp },
]

const benefits = [
  "Бесплатные приложения для старта",
  "Без скрытых комиссий и платежей",
  "Отмена подписки в любое время",
  "Командный доступ для сотрудников",
  "Регулярные обновления",
  "Данные хранятся в РФ",
]

export default function AboutPage() {
  return (
    <div className="bg-[#f5f5f5]">
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-neutral-300">О платформе DevTrust</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6">
                Мы создаём
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  будущее бизнеса
                </span>
              </h1>

              <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
                DevTrust — платформа, которая упрощает доступ к профессиональным бизнес-инструментам.
                Объединяем лучшие приложения в одном месте.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8
                  hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500"
              >
                <stat.icon className="w-6 h-6 text-neutral-400 mb-4" />
                <div className="text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
                Наша миссия
              </p>
              <h2 className="text-3xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-6">
                Технологии должны быть доступными
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                Мы верим, что технологии должны быть доступными, простыми и безопасными.
                Наша цель — изменить способ, которым компании используют бизнес-приложения.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Платите только за то, чем пользуетесь. Добавляйте сотрудников в один клик.
                Получайте поддержку 24/7. Мы делаем бизнес-технологии доступными для всех.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white 
                  rounded-full font-bold hover:bg-neutral-800 transition-all duration-300 group"
              >
                Открыть каталог
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-neutral-100 p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-violet-500" />
                <h3 className="text-xl font-bold text-neutral-900">Наши принципы</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {values.slice(0, 4).map((value, i) => (
                  <div key={i} className="p-4 bg-neutral-50 rounded-2xl">
                    <div className={`w-10 h-10 bg-${value.color}-50 rounded-xl flex items-center justify-center mb-3`}>
                      <value.icon className={`w-5 h-5 text-${value.color}-500`} />
                    </div>
                    <p className="font-bold text-neutral-900 text-sm">{value.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-24 bg-white border-y border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
              Что нас отличает
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-neutral-900 tracking-tight">
              Наши ценности
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-[#f5f5f5] rounded-3xl border border-neutral-100 p-6 lg:p-8
                  hover:bg-white hover:shadow-xl transition-all duration-500"
              >
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5
                  group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <value.icon className={`w-7 h-7 text-neutral-700`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="bg-neutral-900 rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />

            <div className="relative max-w-2xl mx-auto text-center">
              <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-neutral-400 mb-10">
                Мы строим платформу, которая действительно работает на ваш бизнес
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-neutral-200 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 
                  rounded-full font-bold text-lg hover:bg-neutral-100 transition-all duration-300 group"
              >
                Начать бесплатно
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8 text-violet-500" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4">
              Есть вопросы?
            </h2>
            <p className="text-neutral-500 mb-8">
              Мы всегда рады помочь! Наша команда поддержки готова ответить на любые вопросы.
            </p>
            <a
              href="mailto:support@devtrust.ru"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white 
                rounded-full font-bold hover:bg-neutral-800 transition-all duration-300"
            >
              support@devtrust.ru
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}