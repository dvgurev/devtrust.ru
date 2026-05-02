import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  
  if (!code) {
    return NextResponse.json({ valid: false, error: "Код не указан" }, { status: 400 })
  }

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!promo) {
    return NextResponse.json({ valid: false, error: "Промокод недействителен" })
  }

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: "Срок действия промокода истёк" })
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ valid: false, error: "Промокод больше не действителен" })
  }

  return NextResponse.json({ 
    valid: true, 
    discount: promo.discount 
  })
}