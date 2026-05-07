import { Mail, Phone, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Контакты — Документация DevTrust",
  description: "Контактная информация и поддержка платформы DevTrust",
}

export default function DocsContactPage() {
  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="border-b-2 border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-3">Контакты</div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 text-fg">Контакты и поддерждка</h1>
            <p className="font-mono text-sm text-muted">
              Свяжитесь с нашей командой поддержки, задайте вопросы или получите помощь по использованию платформы
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Card 1 */}
              <div className="border-2 border-border p-8">
                <div className="font-display text-3xl md:text-4xl mb-4 text-fg">Электронная почта</div>
                <p className="font-mono text-sm text-muted mb-4">
                  Для общих вопросов, партнёрских предложений и обратной связи
                </p>
                <a 
                  href="mailto:support@devtrust.ru" 
                  className="font-mono text-sm text-fg hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  support@devtrust.ru
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <p className="font-mono text-xs text-muted mt-2">Обычно отвечаем в течение 24 часов</p>
              </div>

              {/* Contact Card 2 */}
              <div className="border-2 border-border p-8">
                <div className="font-display text-3xl md:text-4xl mb-4 text-fg">Телефон поддержки</div>
                <p className="font-mono text-sm text-muted mb-4">
                  Для срочных вопросов по техническим проблемам и аккаунтам
                </p>
                <a 
                  href="tel:+78001234567" 
                  className="font-mono text-sm text-fg hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  +7 (800) 123-45-67
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <p className="font-mono text-xs text-muted mt-2">Пн–Пт 9:00–18:00 по московскому времени</p>
              </div>

              {/* Contact Card 3 */}
              <div className="border-2 border-border p-8">
                <div className="font-display text-3xl md:text-4xl mb-4 text-fg">Сообщество</div>
                <p className="font-mono text-sm text-muted mb-4">
                  Присоединяйтесь к нашему сообществу разработчиков и пользователей
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://t.me/devtrust_community" 
                    className="font-mono text-sm text-fg hover:text-accent transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram-чат →
                  </a>
                  <a 
                    href="https://github.com/devtrust" 
                    className="font-mono text-sm text-fg hover:text-accent transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="border-2 border-border p-8">
              <div className="font-display text-3xl md:text-4xl mb-6 text-fg">Часто задаваемые вопросы</div>
              <div className="space-y-6">
                <div>
                  <div className="font-display text-2xl mb-2 text-fg">Как получить доступ к документации API?</div>
                  <p className="font-mono text-sm text-muted">
                    Полная документация по API доступна по адресу <Link href="/docs/api" className="text-fg hover:text-accent transition-colors">/docs/api</Link>. 
                    Для доступа требуется авторизация с API-ключом.
                  </p>
                </div>
                <div>
                  <div className="font-display text-2xl mb-2 text-fg">Где найти руководства по интеграциям?</div>
                  <p className="font-mono text-sm text-muted">
                    Все руководства по интеграциям собраны в разделе <Link href="/docs/integrations" className="text-fg hover:text-accent transition-colors">/docs/integrations</Link>. 
                    Там вы найдёте пошаговые инструкции для популярных сервисов.
                  </p>
                </div>
                <div>
                  <div className="font-display text-2xl mb-2 text-fg">Как сообщить об ошибке или предложить улучшение?</div>
                  <p className="font-mono text-sm text-muted">
                    Используйте нашу <a href="/feedback" className="text-fg hover:text-accent transition-colors">форму обратной связи</a> или создайте issue в 
                    соответствующем репозитории на GitHub. Мы ценим ваш вклад!
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Docs */}
            <div className="mt-12 text-center">
              <Link 
                href="/docs" 
                className="font-mono text-sm text-fg hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                ← Вернуться к документации
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
