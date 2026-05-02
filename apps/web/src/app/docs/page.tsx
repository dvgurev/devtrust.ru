import { BookOpen, FileText, Code, MessageSquare, Users, Settings } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Документация — DevTrust",
  description: "Полная документация по использованию платформы DevTrust",
}

export default function DocsPage() {
  const sections = [
    {
      title: "Начало работы",
      description: "Быстрый старт с платформой DevTrust",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      links: [
        { name: "Введение", href: "/docs/getting-started" },
        { name: "Регистрация и настройка", href: "/docs/setup" },
        { name: "Первые шаги", href: "/docs/first-steps" },
      ],
    },
    {
      title: "API и интеграции",
      description: "Документация по API и интеграциям с внешними сервисами",
      icon: <Code className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      links: [
        { name: "REST API", href: "/docs/api" },
        { name: "Webhooks", href: "/docs/webhooks" },
        { name: "Интеграции", href: "/docs/integrations" },
      ],
    },
    {
      title: "Управление аккаунтом",
      description: "Настройки аккаунта, биллинг и безопасность",
      icon: <Settings className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
      links: [
        { name: "Настройки профиля", href: "/docs/account" },
        { name: "Подписки и биллинг", href: "/docs/billing" },
        { name: "Безопасность", href: "/docs/security" },
      ],
    },
    {
      title: "Поддержка",
      description: "Контакты, FAQ и помощь",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      links: [
        { name: "Контакты", href: "/docs/contact" },
        { name: "Часто задаваемые вопросы", href: "/docs/faq" },
        { name: "Сообщество", href: "/docs/community" },
      ],
    },
    {
      title: "Для разработчиков",
      description: "Руководства для разработчиков и SDK",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
      links: [
        { name: "SDK и библиотеки", href: "/docs/sdk" },
        { name: "Примеры кода", href: "/docs/examples" },
        { name: "Лучшие практики", href: "/docs/best-practices" },
      ],
    },
    {
      title: "Администрирование",
      description: "Управление организациями и пользователями",
      icon: <Users className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600",
      links: [
        { name: "Организации", href: "/docs/organizations" },
        { name: "Роли и права", href: "/docs/roles" },
        { name: "Аудит и логи", href: "/docs/audit" },
      ],
    },
  ]

  return (
    <div className="flex-1 bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Документация DevTrust</h1>
            <p className="text-xl text-slate-600">
              Полное руководство по использованию платформы, API и интеграциям
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center bg-slate-100 rounded-full px-4 py-2">
                <span className="text-slate-600 mr-2">Быстрый поиск:</span>
                <input 
                  type="text" 
                  placeholder="Введите запрос..." 
                  className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center mb-6`}>
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                <p className="text-slate-600 mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        {link.name}
                        <span className="ml-2">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Дополнительные ресурсы</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Блог разработчиков</h3>
                <p className="text-slate-600 mb-4">
                  Статьи, обновления и анонсы новых функций от нашей команды.
                </p>
                <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
                  Читать блог →
                </Link>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Видеоуроки</h3>
                <p className="text-slate-600 mb-4">
                  Пошаговые видео по использованию платформы и интеграциям.
                </p>
                <a 
                  href="https://youtube.com/c/devtrust" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Смотреть на YouTube →
                </a>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">GitHub репозитории</h3>
                <p className="text-slate-600 mb-4">
                  Исходный код SDK, примеры и open-source компоненты.
                </p>
                <a 
                  href="https://github.com/devtrust" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Перейти на GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}