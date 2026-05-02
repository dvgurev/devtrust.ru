import Link from "next/link"
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react"

export default async function CheckoutErrorPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await props.searchParams
  const error = params.error

  let errorMessage = "Произошла ошибка при оплате"
  if (error === "payment_failed") {
    errorMessage = "Платёж не прошёл. Проверьте данные карты и попробуйте снова"
  } else if (error === "expired") {
    errorMessage = "Сессия оплаты истекла. Создайте новый заказ"
  } else if (error === "cancelled") {
    errorMessage = "Оплата была отменена"
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">Оплата не завершена</h1>
          <p className="text-slate-600 mb-8">{errorMessage}</p>

          <div className="flex flex-col gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Вернуться в корзину
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              В каталог
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-8">
            Если проблема повторяется, свяжитесь с нами: support@devtrust.ru
          </p>
        </div>
      </div>
    </div>
  )
}
