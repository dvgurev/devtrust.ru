// apps/web/src/app/dashboard/subscriptions/[id]/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Calendar, Settings, AlertCircle, Check, Clock, Zap, Shield, ArrowUpRight } from "lucide-react"
import { SubscriptionEditModal } from "@/components/subscription-edit-modal"

async function getSubscription(id: string) {
    return prisma.subscription.findUnique({
        where: { id },
        include: {
            plan: { include: { app: { include: { plans: { orderBy: { price: "asc" } } } } } },
            organization: { include: { memberships: { where: { role: "OWNER" }, include: { user: true } } } },
        },
    })
}

export default async function SubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params
    const subscription = await getSubscription(id)
    if (!subscription) notFound()

    const app = subscription.plan?.app
    const currentPlan = subscription.plan
    const availablePlans = app?.plans || []
    const periodEnd = subscription.currentPeriodEnd
    const daysLeft = periodEnd ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
    const isExpired = daysLeft !== null && daysLeft < 0
    const isActive = subscription.status === "ACTIVE"

    const planToProps = (p: any) => ({ id: p.id, name: p.name, price: Number(p.price), slug: p.slug, features: p.features as string[] | null })

    return (
        <div>
            {/* Back */}
            <Link href="/dashboard/subscriptions" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-4 lg:mb-6">
                <ArrowLeft className="w-4 h-4" /> Назад
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 lg:mb-8">
                <div className="flex items-start gap-3 lg:gap-5">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-neutral-100 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                        {app?.iconUrl ? <img src={app.iconUrl} alt={app.name} className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl" /> : <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 text-neutral-500" />}
                    </div>
                    <div>
                        <h1 className="text-xl lg:text-4xl font-black text-neutral-900 tracking-tight">{app?.name || "Приложение"}</h1>
                        <p className="text-neutral-500 text-sm mt-0.5">Управление подпиской</p>
                    </div>
                </div>
                <div>
                    {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs lg:text-sm"><Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Активна</span>
                    ) : isExpired ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-red-50 text-red-700 rounded-full font-bold text-xs lg:text-sm"><AlertCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Истекла</span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-amber-50 text-amber-700 rounded-full font-bold text-xs lg:text-sm"><AlertCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Неактивна</span>
                    )}
                </div>
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6 mb-4 lg:mb-6">
                <h2 className="font-bold text-neutral-900 text-sm lg:text-lg mb-3 lg:mb-4">Текущий тариф</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 lg:p-5 bg-violet-50 rounded-xl lg:rounded-2xl border border-violet-100">
                    <div>
                        <p className="font-bold text-violet-900 text-sm lg:text-lg">{currentPlan?.name}</p>
                        <p className="text-violet-700 text-xs lg:text-sm mt-0.5">
                            {currentPlan?.price > 0 ? `${currentPlan.price.toLocaleString("ru")} ₽/мес` : "Бесплатный тариф"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {periodEnd && (
                            <div className="flex items-center gap-1.5 text-xs lg:text-sm">
                                <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-violet-500" />
                                {isExpired ? <span className="text-red-600 font-medium">Истекла</span>
                                    : isExpiringSoon ? <span className="text-amber-600 font-medium">Через {daysLeft} дн.</span>
                                        : <span className="text-violet-700">До {new Date(periodEnd).toLocaleDateString("ru")}</span>}
                            </div>
                        )}
                        <SubscriptionEditModal subscriptionId={subscription.id} currentPlanId={currentPlan?.id} plans={availablePlans.map(planToProps)} />
                    </div>
                </div>
            </div>

            {/* Available Plans */}
            {availablePlans.length > 1 && (
                <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6 mb-4 lg:mb-6">
                    <div className="flex items-center gap-2 mb-3 lg:mb-4">
                        <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
                        <h2 className="font-bold text-neutral-900 text-sm lg:text-lg">Доступные тарифы</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                        {availablePlans.map((plan) => {
                            const isCurrent = plan.id === currentPlan?.id
                            const features = (plan.features as string[]) || []
                            return (
                                <div key={plan.id} className={`relative rounded-xl lg:rounded-2xl border-2 p-3 lg:p-5 ${isCurrent ? "border-violet-500 bg-violet-50/50" : "border-neutral-100"}`}>
                                    {isCurrent && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-violet-500 text-white rounded-full text-[10px] lg:text-xs font-bold">Текущий</span>}
                                    <div className="text-center mb-3 lg:mb-4">
                                        <p className="font-bold text-neutral-900 text-sm lg:text-lg">{plan.name}</p>
                                        <p className="text-xl lg:text-2xl font-black text-neutral-900 mt-1">{plan.price > 0 ? `${Number(plan.price)} ₽` : "Бесплатно"}</p>
                                        {plan.price > 0 && <p className="text-xs lg:text-sm text-neutral-400">/мес</p>}
                                    </div>
                                    {features.length > 0 && (
                                        <ul className="space-y-1.5 lg:space-y-2 mb-3 lg:mb-4">
                                            {features.slice(0, 5).map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs lg:text-sm"><Check className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-neutral-600">{f}</span></li>
                                            ))}
                                        </ul>
                                    )}
                                    {!isCurrent && <SubscriptionEditModal subscriptionId={subscription.id} currentPlanId={currentPlan?.id} targetPlanId={plan.id} plans={availablePlans.map(planToProps)} />}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" /><h3 className="font-bold text-neutral-900 text-sm lg:text-base">Отменить подписку</h3></div>
                    <p className="text-xs lg:text-sm text-neutral-500 mb-3 lg:mb-4">Подписка будет активна до конца оплаченного периода.</p>
                    <button className="px-4 py-2 lg:px-5 lg:py-2.5 border-2 border-red-200 text-red-600 rounded-full font-bold text-xs lg:text-sm hover:bg-red-50 transition-all">Отменить подписку</button>
                </div>
                <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 lg:w-5 lg:h-5 text-violet-500" /><h3 className="font-bold text-neutral-900 text-sm lg:text-base">Нужна помощь?</h3></div>
                    <p className="text-xs lg:text-sm text-neutral-500 mb-3 lg:mb-4">Свяжитесь с поддержкой.</p>
                    <Link href="/docs/contact" className="inline-flex items-center gap-1.5 px-4 py-2 lg:px-5 lg:py-2.5 bg-neutral-900 text-white rounded-full font-bold text-xs lg:text-sm hover:bg-neutral-800 transition-all">Связаться <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" /></Link>
                </div>
            </div>
        </div>
    )
}