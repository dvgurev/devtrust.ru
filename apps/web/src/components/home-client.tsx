"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, Play, Star, Zap, Shield, Rocket, Globe, Users, TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef, useCallback } from "react"

// ==================== Константы ====================
const features = [
  {
    title: "Единая экосистема",
    description: "CRM, документы, аналитика в одном интерфейсе без переключения между сервисами",
    icon: Globe,
  },
  {
    title: "Оплата за использование",
    description: "Тарифы зависят от активных пользователей. Никаких скрытых платежей",
    icon: TrendingUp,
  },
  {
    title: "Мгновенный старт",
    description: "Доступ к сервисам сразу после оплаты. Без долгой настройки",
    icon: Rocket,
  },
  {
    title: "Данные в РФ",
    description: "Полное соответствие стандартам безопасности и законодательству",
    icon: Shield,
  },
]

const steps = [
  { step: "01", title: "Выберите приложения", description: "Найдите нужные инструменты в каталоге" },
  { step: "02", title: "Оформите подписку", description: "Оплатите удобным способом" },
  { step: "03", title: "Начните работать", description: "Пользуйтесь сразу после оплаты" },
]

const stats = [
  { value: "500+", label: "компаний" },
  { value: "50+", label: "приложений" },
  { value: "10K+", label: "пользователей" },
  { value: "99.9%", label: "uptime" },
]

// ==================== Хуки ====================
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// ==================== Анимированные секции ====================
function FadeInSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ==================== Hero Section ====================
function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center bg-[#f5f5f5] overflow-hidden"
    >
      {/* Фоновый градиент, следующий за мышью */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(139, 92, 246, 0.15) 0%, 
            rgba(236, 72, 153, 0.1) 30%, 
            transparent 70%)`,
        }}
      />

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-16 py-20 w-full">
        <div className="max-w-4xl">
          {/* Метка */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200 mb-10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-neutral-500">Платформа бизнес-приложений</span>
          </div>

          {/* Заголовок */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight mb-8">
            <span className="block">Dev</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
              Trust
            </span>
          </h1>

          {/* Описание */}
          <p className="text-xl md:text-2xl text-neutral-500 leading-relaxed mb-12 max-w-xl">
            Платформа для бизнес-приложений по подписке.
            Всё для вашего бизнеса в одном месте.
          </p>

          {/* Кнопки */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-3 px-8 py-4 
                bg-neutral-900 text-white rounded-full font-medium text-lg
                hover:bg-neutral-800 hover:scale-105
                transition-all duration-300"
            >
              Выбрать приложения
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-8 py-4 
                bg-white text-neutral-900 rounded-full font-medium text-lg
                border border-neutral-200 hover:border-neutral-300
                hover:scale-105 transition-all duration-300"
            >
              Бесплатный старт
              <span className="text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Скролл-индикатор */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-neutral-400 tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-neutral-300 to-transparent" />
      </div>
    </section>
  )
}

// ==================== Stats ====================
function StatsSection() {
  return (
    <section className="relative bg-neutral-900 text-white py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-400 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ==================== Categories ====================
function CategoriesSection({ categories }: { categories: any[] }) {
  if (!categories.length) return null

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <FadeInSection className="mb-16 lg:mb-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                Категории
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                Выберите <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
                  инструменты
                </span>
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden md:flex items-center gap-2 text-neutral-900 font-medium 
                hover:text-violet-600 transition-colors"
            >
              Все категории
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <FadeInSection key={cat.id} delay={i * 100}>
              <Link href={`/catalog?category=${cat.slug}`}>
                <div className="group relative bg-neutral-50 rounded-2xl p-6 lg:p-8 
                  hover:bg-violet-50 transition-all duration-300 h-full
                  border border-transparent hover:border-violet-200">
                  <div className="text-4xl mb-4">{cat.name.charAt(0)}</div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-violet-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {cat._count.apps} приложений
                  </p>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}



// ==================== How It Works ====================
function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <FadeInSection className="mb-16 lg:mb-20">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Процесс
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Как это{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
              работает
            </span>
          </h2>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
          {steps.map((step, i) => (
            <FadeInSection key={i} delay={i * 200}>
              <div className="group">
                <div className="text-7xl font-black text-neutral-200 mb-6 group-hover:text-violet-200 
                  transition-colors duration-500">
                  {step.step}
                </div>
                <div className="w-16 h-px bg-neutral-200 mb-6" />
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-500 text-lg leading-relaxed">{step.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== Features ====================
function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#f5f5f5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <FadeInSection className="mb-16 lg:mb-20">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Преимущества
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Почему{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
              DevTrust
            </span>
          </h2>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={i} delay={i * 150}>
              <div className="group bg-white rounded-3xl p-8 lg:p-10 
                hover:shadow-xl transition-all duration-500 h-full">
                <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6
                  group-hover:bg-violet-600 transition-colors duration-500">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{f.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== CTA ====================
function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-neutral-900 text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 text-center">
        <FadeInSection>
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">
            Начните сейчас
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            Готовы{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              начать?
            </span>
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-xl mx-auto">
            Зарегистрируйтесь и получите доступ к профессиональным инструментам для вашего бизнеса
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-10 py-5 
                bg-white text-neutral-900 rounded-full font-bold text-lg
                hover:bg-neutral-100 hover:scale-105
                transition-all duration-300"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-3 px-10 py-5 
                border border-neutral-700 text-white rounded-full font-bold text-lg
                hover:border-neutral-500 hover:bg-neutral-800
                transition-all duration-300"
            >
              Посмотреть каталог
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ==================== Главный компонент ====================
interface HomeClientProps {
  featuredApps: any[]
  categories: any[]
}

export default function HomeClient({ featuredApps, categories }: HomeClientProps) {
  return (
    <main className="relative">
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}