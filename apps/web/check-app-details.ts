import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const app = await prisma.app.findUnique({
    where: { slug: 'analytics-pro' },
    select: { isExternal: true, externalUrl: true, subdomain: true, isFree: true }
  })
  console.log('App details:', app)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})