"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ShoppingCart as CartIcon } from "lucide-react"

export interface CartItem {
  appId: string
  appSlug: string
  appName: string
  planId: string
  planName: string
  price: number
}

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("cart")
  return stored ? JSON.parse(stored) : []
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setItems(getInitialCart())
    setIsLoaded(true)
  }, [])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.appId === item.appId)) return prev
      const updated = [...prev, item]
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (appId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.appId !== appId)
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return { items, isLoaded, addItem, removeItem, clearCart, total }
}

export function CartIndicator() {
  const { items } = useCart()

  if (items.length === 0) return null

  return (
    <Link href="/cart" className="relative">
      <CartIcon className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {items.length}
      </span>
    </Link>
  )
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}