import { BookOpen, FileText, Code, MessageSquare, Users, Settings, ArrowRight } from "lucide-react"
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
      links: [
        { name: "Организации", href: "/docs/organizations" },
        { name: "Роли и права", href: "/docs/roles" },
        { name: "Аудит и логи", href: "/docs/audit" },
      ],
    },
  ]

  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="border-b-2 border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Документация</div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 text-fg">Документация DevTrust</h1>
            <p className="text-fg font-mono text-sm">
              Полное руководство по использованию платформы, API и интеграциям
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center border-2 border-border px-4 py-2 font-mono text-sm text-muted">
                <span className="mr-2">Быстрый поиск:</span>
                <input 
                  type="text" 
                  placeholder="Введите запрос..." 
                  className="bg-transparent border-none outline-none text-fg placeholder:text-muted font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <div key={index} className="border-2 border-border p-8 hover:border-fg/50 transition-all">
                <div className="w-12 h-12 border-2 border-fg/20 flex items-center justify-center mb-6">
                  {section.icon}
                </div>
                <h3 className="font-display text-2xl mb-3 text-fg">{section.title}</h3>
                <p className="text-muted font-mono text-sm mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.links.map((link: any, linkIndex: number) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-fg hover:text-accent font-mono text-sm flex items-center"
                      >
                        {link.name}
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-12 border-2 border-border p-8">
            <h2 className="font-display text-3xl md:text-4xl mb-6 text-fg">Дополнительные ресурсы</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border-2 border-border p-6">
                <h3 className="font-display text-xl mb-3 text-fg">Блог разработчиков</h3>
                <p className="text-muted font-mono text-sm mb-4">
                  Статьи, обновления и анонсы новых функций от нашей команды.
                </p>
                <Link href="/blog" className="text-fg hover:text-accent font-mono text-sm flex items-center">
                  Читать блог
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </div>
              <div className="border-2 border-border p-6">
                <h3 className="font-display text-xl mb-3 text-fg">Видеоуроки</h3>
                <p className="text-muted font-mono text-sm mb-4">
                  Поашаговые видео по использованию платформы и интеграциям.
                </p>
                <a 
                  href="https://youtube.com/c/devtrust" 
                  className="text-fg hover:text-accent font-mono text-sm flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Смотреть на YouTube
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
              <div className="border-2 border-border p-6">
                <h3 className="font-display text-xl mb-3 text-fg">GitHub репозитории</h3>
                <p className="text-muted font-mono text-sm mb-4">
                  Исходный код SDK, примеры и open-source компоненты.
                </p>
                <a 
                  href="https://github.com/devtrust" 
                  className="text-fg hover:text-accent font-mono text-sm flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Перейти на GitHub
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
