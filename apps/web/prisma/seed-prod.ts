import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  const isProduction = process.env.NODE_ENV === "production"

  // В продакшене пароль должен быть из переменных окружения
  const adminPassword = isProduction
    ? process.env.ADMIN_PASSWORD
    : process.env.ADMIN_PASSWORD || "admin123"

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required in production")
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@devtrust.ru"

  // Проверяем, существует ли уже админ
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log(`⚠️  Admin user already exists: ${adminEmail}`)

    // Обновляем роль, если она не ADMIN
    if (existingAdmin.role !== "ADMIN") {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "ADMIN" },
      })
      console.log("✅ Updated existing admin role to ADMIN")
    }

    console.log("✅ Seed completed (admin already exists)")
    return
  }

  // Создаем админа
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Администратор",
      password: hashedPassword,
      role: "ADMIN", // Используем enum значение
      isVerified: true,
      emailVerified: new Date(),
    },
  })

  console.log("✅ Created admin user:")
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Role: ${admin.role}`)

  if (!isProduction) {
    console.log(`   Password: ${adminPassword}`)
  }

  console.log("✅ Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })