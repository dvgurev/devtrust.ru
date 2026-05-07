// apps/web/src/app/docs/contact/page.tsx
import { Mail, Phone, MessageSquare, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Контакты — DevTrust",
  description: "Контактная информация и поддержка платформы DevTrust",
}

export default function DocsContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 lg:pt-8">
        <Link href="/docs" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6 lg:mb-8">
          <ArrowLeft className="w-4 h-4" /> Документация
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pb-12 lg:pb-16">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-3">Контакты и поддержка</h1>
          <p className="text-neutral-500 text-sm lg:text-lg max-w-2xl">Свяжитесь с командой поддержки, задайте вопросы или получите помощь</p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-8 lg:mb-12">
          {[
            { icon: Mail, title: "Email", value: "support@devtrust.ru", href: "mailto:support@devtrust.ru", desc: "Для общих вопросов и обратной связи", note: "Ответ в течение 24 часов" },
            { icon: Phone, title: "Телефон", value: "+7 (800) 123-45-67", href: "tel:+78001234567", desc: "Для срочных технических вопросов", note: "Пн–Пт 9:00–18:00 МСК" },
            { icon: MessageSquare, title: "Сообщество", value: "Telegram / GitHub", href: "#", desc: "Присоединяйтесь к сообществу", note: "Чат и репозитории" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4">
                <card.icon className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-700" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm lg:text-lg mb-1">{card.title}</h3>
              <p className="text-neutral-500 text-xs lg:text-sm mb-2">{card.desc}</p>
              <a href={card.href} className="inline-flex items-center gap-1.5 text-sm lg:text-base font-bold text-violet-600 hover:text-violet-700">
                {card.value} <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </a>
              <p className="text-[10px] lg:text-xs text-neutral-400 mt-2">{card.note}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-8">
          <h2 className="text-lg lg:text-3xl font-black text-neutral-900 mb-4 lg:mb-6">Частые вопросы</h2>
          <div className="space-y-4 lg:space-y-6">
            {[
              { q: "Как получить доступ к API?", a: <>Документация доступна в разделе <Link href="/docs/api" className="text-violet-600 font-medium hover:text-violet-700">API</Link>. Требуется авторизация с API-ключом.</> },
              { q: "Где найти руководства по интеграциям?", a: <>Все руководства собраны в разделе <Link href="/docs/integrations" className="text-violet-600 font-medium hover:text-violet-700">Интеграции</Link>.</> },
              { q: "Как сообщить об ошибке?", a: "Используйте форму обратной связи или создайте issue на GitHub." },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-bold text-neutral-900 text-sm lg:text-lg mb-1">{faq.q}</h3>
                <p className="text-neutral-500 text-xs lg:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/docs" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-all">
            <ArrowLeft className="w-4 h-4" /> Вернуться к документации
          </Link>
        </div>
      </div>
    </div>
  )
}