import Link from "next/link"
import { AlertCircle, ArrowLeft, ShoppingCart, ArrowUpRight, Shield } from "lucide-react"

export default async function CheckoutErrorPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await props.searchParams
  const error = params.error

  let errorTitle = "Оплата не завершена"
  let errorMessage = "Произошла ошибка при оплате"

  if (error === "payment_failed") {
    errorTitle = "Платёж не прошёл"
    errorMessage = "Проверьте данные карты и попробуйте снова"
  } else if (error === "expired") {
    errorTitle = "Сессия истекла"
    errorMessage = "Сессия оплаты истекла. Создайте новый заказ"
  } else if (error === "cancelled") {
    errorTitle = "Оплата отменена"
    errorMessage = "Вы отменили оплату. Вы можете повторить попытку в любое время"
  }

  return (
    <div className="min-h-[80vh] bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-100 p-8 lg:p-10 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight mb-3">
          {errorTitle}
        </h1>

        {/* Message */}
        <p className="text-neutral-500 leading-relaxed mb-8">
          {errorMessage}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 
              bg-neutral-900 text-white rounded-2xl font-bold
              hover:bg-neutral-800 transition-all duration-300 group"
          >
            <ShoppingCart className="w-5 h-5" />
            Вернуться в корзину
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 
              border-2 border-neutral-200 text-neutral-700 rounded-2xl font-bold
              hover:bg-neutral-50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            В каталог
          </Link>
        </div>

        {/* Help */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-2">
            <Shield className="w-4 h-4" />
            <span>Нужна помощь?</span>
          </div>
          <a
            href="mailto:support@devtrust.ru"
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            support@devtrust.ru
          </a>
        </div>
      </div>
    </div>
  )
}