"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X, Trash2, Tag, ArrowRight } from "lucide-react"

interface CartItem {
  appId: string
  appSlug: string
  appName: string
  planId: string
  planName: string
  price: number
}

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  const removeItem = (appId: string) => {
    const updated = items.filter((i) => i.appId !== appId)
    setItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const discountAmount = Math.round(subtotal * discount / 100)
  const yearlyDiscount = period === "yearly" ? Math.round(subtotal * 0.2) : 0
  const total = subtotal - discountAmount - yearlyDiscount

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          period,
          promoCode: promoApplied ? promoCode : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Ошибка при создании заказа")
        return
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      console.error(err)
      alert("Ошибка при создании заказа")
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-gray-600 mb-4">Добавьте приложения в корзину</p>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.appId}
                  className="flex items-center justify-between p-4 border-b last:border-0"
                >
                  <div>
                    <Link
                      href={`/apps/${item.appSlug}`}
                      className="font-semibold hover:text-blue-600"
                    >
                      {item.appName}
                    </Link>
                    <p className="text-sm text-gray-500">{item.planName}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.price} ₽/мес</span>
                    <button
                      onClick={() => removeItem(item.appId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm mt-4 p-4">
              <label className="block text-sm font-medium mb-2">Промокод</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    disabled={promoApplied}
                  />
                </div>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/promo/validate?code=${promoCode}`)
                      const data = await res.json()
                      if (data.valid) {
                        setDiscount(data.discount)
                        setPromoApplied(true)
                      } else {
                        alert(data.error || "Промокод недействителен")
                      }
                    } catch {
                      alert("Ошибка проверки промокода")
                    }
                  }}
                  disabled={promoApplied || !promoCode}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Итого</h3>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">Период оплаты</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                      period === "monthly" ? "border-blue-600 bg-blue-50" : ""
                    }`}
                  >
                    Месяц
                  </button>
                  <button
                    onClick={() => setPeriod("yearly")}
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                      period === "yearly" ? "border-blue-600 bg-blue-50" : ""
                    }`}
                  >
                    Год (-20%)
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Подписки ({items.length})</span>
                  <span>{subtotal} ₽</span>
                </div>
                {promoApplied && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка ({discount}%)</span>
                    <span>-{discountAmount} ₽</span>
                  </div>
                )}
                {yearlyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>За год (-20%)</span>
                    <span>-{yearlyDiscount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Итого</span>
                  <span>{total} ₽{period === "yearly" ? "/год" : "/мес"}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Оформить заказ <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Оплата через Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}