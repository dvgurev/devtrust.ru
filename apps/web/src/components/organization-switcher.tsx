"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Building2 } from "lucide-react"

interface Organization {
  id: string
  name: string
}

export function OrganizationSwitcher({ currentOrgId }: { currentOrgId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const currentOrg = organizations.find((o) => o.id === currentOrgId)

  useEffect(() => {
    fetch("/api/user/organizations")
      .then((res) => res.json())
      .then((data) => setOrganizations(data.organizations || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest(".organization-switcher")) {
        setIsOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (organizations.length <= 1) {
    return null
  }

  return (
    <div className="relative organization-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <Building2 className="w-4 h-4" />
        <span>{currentOrg?.name || "Организация"}</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                router.push(`/dashboard/switch-org?org=${org.id}`)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                org.id === currentOrgId ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              {org.name}
              {org.id === currentOrgId && " ✓"}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}