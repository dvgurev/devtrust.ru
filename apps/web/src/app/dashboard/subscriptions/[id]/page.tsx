import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft, CreditCard, Calendar, Settings, AlertCircle,
    Check, Clock, Zap, Shield, ArrowUpRight
} from "lucide-react"
import { SubscriptionEditModal } from "@/components/subscription-edit-modal"

async function getSubscription(id: string) {
    return prisma.subscription.findUnique({
        where: { id },
        include: {
            plan: {
                include: {
                    app: {
                        include: {
                            plans: {
                                orderBy: { price: "asc" },
                            },
                        },
                    },
                },
            },
            organization: {
                include: {
                    memberships: {
                        where: { role: "OWNER" },
                        include: { user: true },
                    },
                },
            },
        },
    })
}

export default async function SubscriptionPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth()
    if (!session?.user || !session.user.id) {
        redirect("/login")
    }

    const { id } = await params
    const subscription = await getSubscription(id)

    if (!subscription) {
        notFound()
    }

    const app = subscription.plan?.app
    const currentPlan = subscription.plan
    const availablePlans = app?.plans || []
    const periodEnd = subscription.currentPeriodEnd
    const daysLeft = periodEnd
        ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
    const isExpired = daysLeft !== null && daysLeft < 0
    const isActive = subscription.status === "ACTIVE"

    return (
        <div className="space-y-8">
            {/* Back Link */}
            <Link
                href="/dashboard/subscriptions"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 
          hover:text-neutral-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Назад к подпискам
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {app?.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-xl" />
                        ) : (
                            <CreditCard className="w-8 h-8 text-neutral-500" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                            {app?.name || "Приложение"}
                        </h1>
                        <p className="text-neutral-500 mt-1">Управление подпиской</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                    {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 
              text-emerald-700 rounded-full font-bold text-sm">
                            <Check className="w-4 h-4" />
                            Активна
                        </span>
                    ) : isExpired ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 
              text-red-700 rounded-full font-bold text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Истекла
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 
              text-amber-700 rounded-full font-bold text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Неактивна
                        </span>
                    )}
                </div>
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-violet-500" />
                    <h2 className="text-lg font-bold text-neutral-900">Текущий тариф</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 
          bg-violet-50 rounded-2xl border border-violet-100">
                    <div>
                        <p className="font-bold text-violet-900 text-lg">{currentPlan?.name}</p>
                        <p className="text-violet-700 text-sm mt-0.5">
                            {currentPlan?.price > 0
                                ? `${currentPlan.price.toLocaleString("ru")} ₽/мес`
                                : "Бесплатный тариф"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {periodEnd && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-violet-500" />
                                {isExpired ? (
                                    <span className="text-red-600 font-medium">Истекла</span>
                                ) : isExpiringSoon ? (
                                    <span className="text-amber-600 font-medium">
                                        Истекает через {daysLeft} дн.
                                    </span>
                                ) : (
                                    <span className="text-violet-700">
                                        До {new Date(periodEnd).toLocaleDateString("ru")}
                                    </span>
                                )}
                            </div>
                        )}
                        <SubscriptionEditModal
                            subscriptionId={subscription.id}
                            currentPlanId={currentPlan?.id}
                            plans={availablePlans.map(p => ({
                                id: p.id,
                                name: p.name,
                                price: Number(p.price),
                                slug: p.slug,
                                features: p.features as string[] | null,
                            }))}
                        />
                    </div>
                </div>
            </div>

            {/* Available Plans */}
            {availablePlans.length > 1 && (
                <div className="bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-neutral-900">Доступные тарифы</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availablePlans.map((plan) => {
                            const isCurrent = plan.id === currentPlan?.id
                            const features = (plan.features as string[]) || []

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl border-2 p-5 ${isCurrent
                                            ? "border-violet-500 bg-violet-50/50"
                                            : "border-neutral-100 hover:border-neutral-200"
                                        }`}
                                >
                                    {isCurrent && (
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 
                      bg-violet-500 text-white rounded-full text-xs font-bold">
                                            Текущий
                                        </span>
                                    )}

                                    <div className="text-center mb-4">
                                        <p className="font-bold text-neutral-900 text-lg">{plan.name}</p>
                                        <p className="text-2xl font-black text-neutral-900 mt-1">
                                            {plan.price > 0 ? `${Number(plan.price)} ₽` : "Бесплатно"}
                                        </p>
                                        {plan.price > 0 && (
                                            <p className="text-sm text-neutral-400">/мес</p>
                                        )}
                                    </div>

                                    {features.length > 0 && (
                                        <ul className="space-y-2 mb-4">
                                            {features.slice(0, 5).map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-neutral-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {!isCurrent && (
                                        <SubscriptionEditModal
                                            subscriptionId={subscription.id}
                                            currentPlanId={currentPlan?.id}
                                            targetPlanId={plan.id}
                                            plans={availablePlans.map(p => ({
                                                id: p.id,
                                                name: p.name,
                                                price: Number(p.price),
                                                slug: p.slug,
                                                features: p.features as string[] | null,
                                            }))}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
                {/* Cancel */}
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-neutral-900">Отменить подписку</h3>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">
                        При отмене подписка будет активна до конца оплаченного периода.
                    </p>
                    <form action={async () => {
                        "use server"
                        // Логика отмены подписки
                    }}>
                        <button
                            type="submit"
                            className="px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-full 
                font-bold text-sm hover:bg-red-50 transition-all duration-300"
                        >
                            Отменить подписку
                        </button>
                    </form>
                </div>

                {/* Support */}
                <div className="bg-white rounded-3xl border border-neutral-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-violet-500" />
                        <h3 className="font-bold text-neutral-900">Нужна помощь?</h3>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">
                        Свяжитесь с поддержкой для решения вопросов по подписке.
                    </p>
                    <Link
                        href="/docs/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white 
              rounded-full font-bold text-sm hover:bg-neutral-800 transition-all duration-300"
                    >
                        Связаться
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}