"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X, Trash2, Tag, ArrowRight, Sparkles, Shield, Zap, ShoppingBag, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

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
  const [isCheckingOut, setIsCheckingOut] = useState(false)

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
    setIsCheckingOut(true)
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
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-black text-neutral-900 mb-3">Корзина пуста</h1>
          <p className="text-neutral-500 mb-8 text-lg">
            Добавьте приложения в корзину и начните автоматизацию бизнеса
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white 
              rounded-full font-bold text-lg hover:bg-neutral-800 
              transition-all duration-300 hover:scale-105"
          >
            Перейти в каталог
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Banner */}
      <div className="bg-neutral-900 text-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
              Оформление заказа
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              Корзина
            </h1>
            <p className="text-lg text-neutral-400">
              {items.length} {items.length === 1 ? 'приложение' : items.length < 5 ? 'приложения' : 'приложений'} в заказе
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-violet-500" />
                  Выбранные приложения
                </h2>
              </div>

              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.appId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-6 border-b border-neutral-50 
                      last:border-0 hover:bg-neutral-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center 
                        flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                        <span className="text-violet-600 font-bold text-lg">
                          {item.appName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/apps/${item.appSlug}`}
                          className="font-bold text-neutral-900 hover:text-violet-600 
                            transition-colors truncate block"
                        >
                          {item.appName}
                        </Link>
                        <p className="text-sm text-neutral-500">{item.planName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-right">
                        <span className="font-bold text-lg text-neutral-900">
                          {item.price} ₽
                        </span>
                        <span className="text-sm text-neutral-400 block">/мес</span>
                      </div>
                      <button
                        onClick={() => removeItem(item.appId)}
                        className="w-10 h-10 flex items-center justify-center rounded-full
                          text-neutral-400 hover:text-red-500 hover:bg-red-50
                          transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 mt-6">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-500" />
                Промокод
              </h3>

              {promoApplied ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-green-50 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700">Промокод применён!</p>
                      <p className="text-sm text-green-600">Скидка {discount}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPromoCode("")
                      setPromoApplied(false)
                      setDiscount(0)
                    }}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Введите промокод"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 
                        rounded-2xl text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                        transition-all duration-300 font-medium"
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
                    disabled={!promoCode}
                    className="px-6 py-3.5 bg-neutral-900 text-white rounded-2xl font-medium
                      hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-300"
                  >
                    Применить
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 sticky top-24">
              <h3 className="text-xl font-black text-neutral-900 mb-6">Итого</h3>

              {/* Period Selector */}
              <div className="mb-6">
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Период оплаты
                </p>
                <div className="flex bg-neutral-50 rounded-2xl p-1.5">
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${period === "monthly"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    Месяц
                  </button>
                  <button
                    onClick={() => setPeriod("yearly")}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${period === "yearly"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    Год
                    <span className="absolute -top-2 -right-1 px-2 py-0.5 bg-green-500 text-white 
                      text-[10px] font-bold rounded-full">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Подписки ({items.length})</span>
                  <span className="font-bold text-neutral-900">{subtotal} ₽</span>
                </div>

                {period === "yearly" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between items-center text-green-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Скидка за год (-20%)
                    </span>
                    <span className="font-bold">-{yearlyDiscount} ₽</span>
                  </motion.div>
                )}

                {promoApplied && discount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between items-center text-violet-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Промокод (-{discount}%)
                    </span>
                    <span className="font-bold">-{discountAmount} ₽</span>
                  </motion.div>
                )}

                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-neutral-900">Итого</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-neutral-900">{total} ₽</span>
                      <span className="text-sm text-neutral-400 block">
                        {period === "yearly" ? "/год" : "/мес"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full mt-8 px-6 py-4 bg-neutral-900 text-white rounded-2xl 
                  font-bold text-lg hover:bg-neutral-800 transition-all duration-300
                  hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 group"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent 
                      rounded-full animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Оформить заказ
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-neutral-400 justify-center">
                  <Shield className="w-4 h-4 text-green-500" />
                  Безопасная оплата
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                  <div className="w-8 h-5 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}