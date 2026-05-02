import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

async function syncStripeProducts() {
  console.log("Syncing Stripe products → Plans...")

  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
      starting_after: startingAfter,
      expand: ["data.default_price"],
    })

    for (const product of products.data) {
      const defaultPrice = product.default_price as any

      if (!defaultPrice || defaultPrice.type !== "recurring") {
        continue
      }

      const appId = product.metadata?.appId
      if (!appId) {
        console.log(`  Skipping "${product.name}" — no appId in metadata`)
        continue
      }

      const planSlug = product.metadata?.slug || product.id.toLowerCase().replace(/[^a-z0-9]/g, "-")

      const existingPlan = await prisma.plan.findUnique({
        where: { appId_slug: { appId, slug: planSlug } },
      })

      if (existingPlan) {
        await prisma.plan.update({
          where: { id: existingPlan.id },
          data: {
            name: product.name,
            price: defaultPrice.unit_amount || 0,
            priceId: defaultPrice.id,
            features: product.metadata?.features
              ? JSON.parse(product.metadata.features)
              : undefined,
          },
        })
        console.log(`  Updated: ${product.name} → Plan ${existingPlan.id}`)
      } else {
        const plan = await prisma.plan.create({
          data: {
            appId,
            slug: planSlug,
            name: product.name,
            price: defaultPrice.unit_amount || 0,
            priceId: defaultPrice.id,
            features: product.metadata?.features
              ? JSON.parse(product.metadata.features)
              : null,
          },
        })
        console.log(`  Created: ${product.name} → Plan ${plan.id}`)
      }
    }

    hasMore = products.has_more
    if (hasMore && products.data.length > 0) {
      startingAfter = products.data[products.data.length - 1].id
    }
  }

  console.log("Sync complete!")
}

syncStripeProducts().catch((err) => {
  console.error("Sync failed:", err)
  process.exit(1)
})
