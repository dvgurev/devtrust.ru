// apps/web/src/app/docs/page.tsx
import { BookOpen, FileText, Code, MessageSquare, Users, Settings, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Документация — DevTrust",
  description: "Полная документация по использованию платформы DevTrust",
}

export default function DocsPage() {
  const sections = [
    {
      title: "Начало работы", description: "Быстрый старт с платформой",
      icon: <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "Введение", href: "/docs/getting-started" },
        { name: "Регистрация и настройка", href: "/docs/setup" },
        { name: "Первые шаги", href: "/docs/first-steps" },
      ],
    },
    {
      title: "API и интеграции", description: "API и интеграции с сервисами",
      icon: <Code className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "REST API", href: "/docs/api" },
        { name: "Webhooks", href: "/docs/webhooks" },
        { name: "Интеграции", href: "/docs/integrations" },
      ],
    },
    {
      title: "Аккаунт", description: "Настройки, биллинг, безопасность",
      icon: <Settings className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "Настройки профиля", href: "/docs/account" },
        { name: "Подписки и биллинг", href: "/docs/billing" },
        { name: "Безопасность", href: "/docs/security" },
      ],
    },
    {
      title: "Поддержка", description: "Контакты, FAQ, помощь",
      icon: <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "Контакты", href: "/docs/contact" },
        { name: "Частые вопросы", href: "/docs/faq" },
        { name: "Сообщество", href: "/docs/community" },
      ],
    },
    {
      title: "Разработчикам", description: "Руководства, SDK, примеры",
      icon: <FileText className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "SDK и библиотеки", href: "/docs/sdk" },
        { name: "Примеры кода", href: "/docs/examples" },
        { name: "Лучшие практики", href: "/docs/best-practices" },
      ],
    },
    {
      title: "Администрирование", description: "Организации, роли, аудит",
      icon: <Users className="w-5 h-5 lg:w-6 lg:h-6" />,
      links: [
        { name: "Организации", href: "/docs/organizations" },
        { name: "Роли и права", href: "/docs/roles" },
        { name: "Аудит и логи", href: "/docs/audit" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-neutral-900 text-white pt-20 pb-12 lg:pt-28 lg:pb-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 lg:mb-8">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-neutral-300">Документация</span>
          </div>
          <h1 className="text-3xl lg:text-7xl font-black tracking-tight mb-4">
            Документация <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">DevTrust</span>
          </h1>
          <p className="text-neutral-400 text-sm lg:text-lg max-w-xl mx-auto mb-8">
            Полное руководство по использованию платформы, API и интеграциям
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text" placeholder="Поиск в документации..."
              className="w-full pl-11 pr-4 py-3 lg:py-3.5 bg-white/10 border border-white/20 rounded-2xl
                text-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-400 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4">
                {section.icon}
              </div>
              <h3 className="font-bold text-neutral-900 text-sm lg:text-lg mb-1">{section.title}</h3>
              <p className="text-neutral-500 text-xs lg:text-sm mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="flex items-center gap-1.5 text-xs lg:text-sm font-medium text-violet-600 hover:text-violet-700">
                      {link.name} <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional */}
        <div className="mt-8 lg:mt-12">
          <h2 className="text-xl lg:text-3xl font-black text-neutral-900 mb-4 lg:mb-6">Дополнительные ресурсы</h2>
          <div className="grid sm:grid-cols-3 gap-3 lg:gap-4">
            {[
              { title: "Блог", desc: "Статьи и обновления", href: "/blog", btn: "Читать" },
              { title: "Видеоуроки", desc: "Пошаговые руководства", href: "#", btn: "Смотреть" },
              { title: "GitHub", desc: "SDK и примеры кода", href: "#", btn: "Перейти" },
            ].map((res, i) => (
              <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
                <h3 className="font-bold text-neutral-900 text-sm lg:text-lg mb-1">{res.title}</h3>
                <p className="text-neutral-500 text-xs lg:text-sm mb-4">{res.desc}</p>
                <Link href={res.href} className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-medium text-violet-600 hover:text-violet-700">
                  {res.btn} <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}