"use client"

import { Sparkles, Users, Shield, HeadphonesIcon, Globe, Heart, ArrowRight, Check, TrendingUp } from "lucide-react"
import Link from "next/link"

const values = [
  { title: "Безопасность", description: "Ваши данные защищены. Мы соответствуем требованиям законодательства РФ и используем современные технологии защиты.", icon: Shield },
  { title: "Простота", description: "Интуитивный интерфейс и мгновенная активация. Начните работать за 5 минут после регистрации.", icon: Users },
  { title: "Поддержка", description: "Техническая поддержка доступна круглосуточно. Мы всегда готовы помочь в решении любых вопросов.", icon: HeadphonesIcon },
  { title: "Доступность", description: "Работаем по всей России. Локализованные решения и поддержка на русском языке.", icon: Globe },
  { title: "Развитие", description: "Постоянно добавляем новые приложения и улучшаем платформу на основе ваших отзывов.", icon: TrendingUp },
  { title: "Забота", description: "Ставим интересы клиентов на первое место. Честные тарифы и прозрачные условия.", icon: Heart },
]

const stats = [
  { value: "500+", label: "КОМПАНИЙ" },
  { value: "50+", label: "ПРИЛОЖЕНИЙ" },
  { value: "10K+", label: "ПОЛЬЗОВАТЕЛЕЙ" },
  { value: "99.9%", label: "UPTIME" },
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
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">О платформе DevTrust</div>
            <h1 className="font-display text-6xl md:text-[10rem] leading-tight tracking-[-0.04em] text-fg mb-6">
              Мы создаём
              <br />
              будущее бизнеса
            </h1>
            <p className="text-muted font-mono text-sm max-w-2xl mx-auto">
              DevTrust — это платформа, которая упрощает доступ к профессиональным бизнес-инструментам. 
              Мы объединяем лучшие приложения в одном месте, чтобы вы могли сосредоточиться на развитии 
              своего бизнеса.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="border-2 border-border p-6 text-center">
                <div className="font-display text-5xl text-fg">{s.value}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6 text-fg">Наша миссия</h2>
              <p className="text-fg font-mono text-sm mb-6 leading-relaxed">
                Мы верим, что технологии должны быть доступными, простыми и безопасными. 
                Наша цель — изменить способ, которым компании используют бизнес-приложения.
              </p>
              <p className="text-muted font-mono text-sm mb-8">
                Платите только за то, чем пользуетесь. Добавляйте сотрудников в один клик. 
                Получайте поддержку 24/7. Мы делаем бизнес-технологии доступными для всех — 
                от стартапов до крупных предприятий.
              </p>
              <Link href="/catalog">
                <div className="font-mono text-xs uppercase tracking-widest border-2 border-accent bg-accent text-bg px-6 py-3 hover:bg-accent/90 transition-all inline-flex items-center gap-2">
                  Открыть каталог
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="border-2 border-border p-8">
              <h3 className="font-display text-3xl mb-6 text-fg text-center">Наши принципы</h3>
              <div className="grid grid-cols-2 gap-4">
                {values.slice(0, 4).map((value, i) => (
                  <div key={i} className="border-2 border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="border-2 border-fg/20 p-2">
                        <value.icon className="w-5 h-5 text-fg" />
                      </div>
                      <span className="font-display text-lg text-fg">{value.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-fg">Что нас отличает</h2>
            <p className="text-muted font-mono text-sm max-w-2xl mx-auto">
              Мы строим платформу, которая действительно работает на ваш бизнес
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value, i) => (
              <div key={i} className="border-2 border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="border-2 border-fg/20 p-3">
                    <value.icon className="w-6 h-6 text-fg" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl mb-2 text-fg">{value.title}</h3>
                    <p className="text-muted font-mono text-sm">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-2 border-border p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl mb-8 text-fg text-center">Почему выбирают нас</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-accent flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-fg font-mono text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/register">
                  <div className="font-mono text-xs uppercase tracking-widest border-2 border-accent bg-accent text-bg px-8 py-4 hover:bg-accent/90 transition-all inline-flex items-center gap-2">
                    Начать бесплатно
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Свяжитесь с нами</div>
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-fg">Есть вопросы?</h2>
            <p className="text-muted font-mono text-sm mb-8">
              Мы всегда рады помочь! Наша команда поддержки готова ответить на любые вопросы.
            </p>
            <a
              href="mailto:support@devtrust.ru"
              className="font-mono text-sm text-fg hover:text-accent transition-colors"
            >
              support@devtrust.ru
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
