import { Mail, Phone, MapPin, Clock, MessageSquare, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Контакты — Документация DevTrust",
  description: "Контактная информация и поддержка платформы DevTrust",
}

export default function DocsContactPage() {
  return (
    <div className="flex-1 bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Контакты и поддержка</h1>
            <p className="text-xl text-slate-600">
              Свяжитесь с нашей командой поддержки, задайте вопросы или получите помощь по использованию платформы
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Card 1 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Электронная почта</h3>
                <p className="text-slate-600 mb-4">
                  Для общих вопросов, партнёрских предложений и обратной связи
                </p>
                <a 
                  href="mailto:support@devtrust.ru" 
                  className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center"
                >
                  support@devtrust.ru
                </a>
                <p className="text-sm text-slate-500 mt-2">Обычно отвечаем в течение 24 часов</p>
              </div>

              {/* Contact Card 2 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Телефон поддержки</h3>
                <p className="text-slate-600 mb-4">
                  Для срочных вопросов по техническим проблемам и аккаунтам
                </p>
                <a 
                  href="tel:+78001234567" 
                  className="text-green-600 font-medium hover:text-green-700 inline-flex items-center"
                >
                  +7 (800) 123-45-67
                </a>
                <p className="text-sm text-slate-500 mt-2">Пн–Пт 9:00–18:00 по московскому времени</p>
              </div>

              {/* Contact Card 3 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Сообщество</h3>
                <p className="text-slate-600 mb-4">
                  Присоединяйтесь к нашему сообществу разработчиков и пользователей
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://t.me/devtrust_community" 
                    className="text-purple-600 font-medium hover:text-purple-700 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram-чат
                  </a>
                  <a 
                    href="https://github.com/devtrust" 
                    className="text-purple-600 font-medium hover:text-purple-700 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Как получить доступ к документации API?</h3>
                  <p className="text-slate-600">
                    Полная документация по API доступна по адресу <Link href="/docs/api" className="text-blue-600 hover:underline">/docs/api</Link>. 
                    Для доступа требуется авторизация с API-ключом.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Где найти руководства по интеграции?</h3>
                  <p className="text-slate-600">
                    Все руководства по интеграции собраны в разделе <Link href="/docs/integrations" className="text-blue-600 hover:underline">/docs/integrations</Link>. 
                    Там вы найдёте пошаговые инструкции для популярных сервисов.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Как сообщить об ошибке или предложить улучшение?</h3>
                  <p className="text-slate-600">
                    Используйте нашу <Link href="/feedback" className="text-blue-600 hover:underline">форму обратной связи</Link> или создайте issue в 
                    соответствующем репозитории на GitHub. Мы ценим ваш вклад!
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Docs */}
            <div className="mt-12 text-center">
              <Link 
                href="/docs" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
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