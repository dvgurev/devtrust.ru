"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Выход..." : "Выйти"}
    </button>
  )
}