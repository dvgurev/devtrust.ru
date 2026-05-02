import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.app.findUnique({ where: { slug: "crm" } })
  if (existing) {
    console.log("CRM already exists")
    return
  }

  const crm = await prisma.app.create({
    data: {
      name: "CRM",
      slug: "crm",
      description: "Система управления взаимоотношениями с клиентами",
      status: "ACTIVE",
      isFree: false,
      isExternal: true,
      externalUrl: "http://localhost:3001",
      subdomain: "crm",
      externalConfig: {
        create: {
          ssoEnabled: true,
          apiSecret: randomBytes(32).toString("hex"),
          allowedDomains: ["localhost:3001"],
        },
      },
    },
  })

  await prisma.plan.createMany({
    data: [
      {
        appId: crm.id,
        name: "Базовый",
        slug: "basic",
        price: 990,
        features: JSON.stringify({
          contactsLimit: 100,
          companiesLimit: 10,
          dealsLimit: 50,
        }),
      },
      {
        appId: crm.id,
        name: "Бизнес",
        slug: "business",
        price: 2990,
        features: JSON.stringify({
          contactsLimit: 1000,
          companiesLimit: 100,
          dealsLimit: 500,
        }),
      },
      {
        appId: crm.id,
        name: "Корпорация",
        slug: "enterprise",
        price: 9900,
        features: JSON.stringify({
          unlimited: true,
        }),
      },
    ],
  })

  console.log("CRM created with plans and external config")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())