import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Creating seed data...")

  // Создаем категории приложений
  const categories = await Promise.all([
    prisma.appCategory.upsert({
      where: { slug: "crm" },
      update: {},
      create: { name: "CRM", slug: "crm", description: "Системы управления клиентами", sortOrder: 1 },
    }),
    prisma.appCategory.upsert({
      where: { slug: "documents" },
      update: {},
      create: { name: "Документы", slug: "documents", description: "Электронный документооборот", sortOrder: 2 },
    }),
    prisma.appCategory.upsert({
      where: { slug: "analytics" },
      update: {},
      create: { name: "Аналитика", slug: "analytics", description: "Бизнес-аналитика", sortOrder: 3 },
    }),
    prisma.appCategory.upsert({
      where: { slug: "accounting" },
      update: {},
      create: { name: "Бухгалтерия", slug: "accounting", description: "Бухгалтерский учет", sortOrder: 4 },
    }),
    prisma.appCategory.upsert({
      where: { slug: "tasks" },
      update: {},
      create: { name: "Задачи", slug: "tasks", description: "Управление задачами", sortOrder: 5 },
    }),
  ])
  console.log("Created app categories")

  // Создаем категории постов
  const postCategories = await Promise.all([
    prisma.postCategory.upsert({
      where: { slug: "news" },
      update: {},
      create: { name: "Новости", slug: "news" },
    }),
    prisma.postCategory.upsert({
      where: { slug: "updates" },
      update: {},
      create: { name: "Обновления", slug: "updates" },
    }),
    prisma.postCategory.upsert({
      where: { slug: "guides" },
      update: {},
      create: { name: "Инструкции", slug: "guides" },
    }),
  ])
  console.log("Created post categories")

  // Создаем приложения
  const apps = await Promise.all([
    prisma.app.upsert({
      where: { slug: "crm-core" },
      update: {},
      create: {
        name: "CRM Core",
        slug: "crm-core",
        description: "Полнофункциональная CRM для управления клиентами и сделками. Включает контакты, компании, сделки, задачи и аналитику.",
        subdomain: "crm",
        categoryId: categories[0].id,
        isFree: false,
        status: "ACTIVE",
        featured: true,
        averageRating: 4.5,
        reviewsCount: 28,
      },
    }),
    prisma.app.upsert({
      where: { slug: "docflow" },
      update: {},
      create: {
        name: "DocFlow",
        slug: "docflow",
        description: "Система электронного документооборота с электронной подписью и архивом.",
        subdomain: "docs",
        categoryId: categories[1].id,
        isFree: false,
        status: "ACTIVE",
        featured: true,
        averageRating: 4.2,
        reviewsCount: 15,
      },
    }),
    prisma.app.upsert({
      where: { slug: "analytics-pro" },
      update: {},
      create: {
        name: "Analytics Pro",
        slug: "analytics-pro",
        description: "Бизнес-аналитика с дашбордами, отчетами и прогнозами.",
        subdomain: "analytics",
        categoryId: categories[2].id,
        isFree: true,
        status: "ACTIVE",
        featured: true,
        averageRating: 4.8,
        reviewsCount: 42,
      },
    }),
    prisma.app.upsert({
      where: { slug: "accountant" },
      update: {},
      create: {
        name: "Бухгалтер",
        slug: "accountant",
        description: "Простая бухгалтерия для малого бизнеса. УСН, ОСНО.",
        categoryId: categories[3].id,
        isFree: false,
        status: "ACTIVE",
        averageRating: 4.0,
        reviewsCount: 8,
      },
    }),
    prisma.app.upsert({
      where: { slug: "tasks-free" },
      update: {},
      create: {
        name: "Task Tracker",
        slug: "tasks-free",
        description: "Управление задачами и проектами. Доска Канбан, командная работа.",
        categoryId: categories[4].id,
        isFree: true,
        status: "ACTIVE",
        featured: true,
        averageRating: 4.3,
        reviewsCount: 56,
      },
    }),
  ])
  console.log("Created apps")

  // Создаем планы для приложений
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[0].id, slug: "basic" } },
      update: {},
      create: { 
        appId: apps[0].id, 
        name: "Базовый", 
        slug: "basic", 
        price: 990,
        yearlyPrice: 9500,
        oneTimePrice: 15000,
        description: "Для небольших команд до 5 человек. Включает все основные функции CRM.",
        features: ["До 5 пользователей", "Контакты и компании", "Сделки и воронка", "Задачи", "Email интеграция", "Базовая аналитика"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[0].id, slug: "pro" } },
      update: {},
      create: { 
        appId: apps[0].id, 
        name: "Профессиональный", 
        slug: "pro", 
        price: 2990,
        yearlyPrice: 25000,
        oneTimePrice: 45000,
        description: "Для растущих компаний. Расширенные функции автоматизации и аналитики.",
        features: ["До 20 пользователей", "Все функции Базового", "Автоматизации", "IP-телефония", "API доступ", "Расширенная аналитика", "Приоритетная поддержка"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[0].id, slug: "enterprise" } },
      update: {},
      create: { 
        appId: apps[0].id, 
        name: "Бизнес", 
        slug: "enterprise", 
        price: 9900,
        yearlyPrice: 90000,
        oneTimePrice: 150000,
        description: "Для крупных компаний. Полный контроль и безопасность данных.",
        features: ["Безлимит пользователей", "Все функции Профессионального", "White label", "SLA гарантии", "Персональный менеджер", "Обучение команды", "Интеграции под ключ"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[1].id, slug: "team" } },
      update: {},
      create: { 
        appId: apps[1].id, 
        name: "Команда", 
        slug: "team", 
        price: 1490,
        yearlyPrice: 14000,
        oneTimePrice: 25000,
        description: "Для малых команд. Электронный документооборот без лишних сложностей.",
        features: ["До 10 пользователей", "Создание документов", "Шаблоны", "Электронная подпись", "История версий"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[1].id, slug: "company" } },
      update: {},
      create: { 
        appId: apps[1].id, 
        name: "Компания", 
        slug: "company", 
        price: 4990,
        yearlyPrice: 45000,
        oneTimePrice: 80000,
        description: "Для среднего бизнеса. Полный документооборот с архивом.",
        features: ["До 50 пользователей", "Все функции Команды", "Архив документов", "Права доступа", "Модуль согласования", "Интеграция с 1С"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[3].id, slug: "start" } },
      update: {},
      create: { 
        appId: apps[3].id, 
        name: "Старт", 
        slug: "start", 
        price: 490,
        yearlyPrice: 4500,
        oneTimePrice: 8000,
        description: "Для ИП и малого бизнеса. Простой учет без бухгалтера.",
        features: ["УСН доходы", "Счета и акты", "Книга учета", "Отчетность онлайн", "Консультации"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[3].id, slug: "business" } },
      update: {},
      create: { 
        appId: apps[3].id, 
        name: "Бизнес", 
        slug: "business", 
        price: 1990,
        yearlyPrice: 18000,
        oneTimePrice: 35000,
        description: "Для малого бизнеса. Полная бухгалтерия с налогами.",
        features: ["УСН и ОСНО", "Все функции Старт", "Налоги и взносы", "Зарплата и кадры", "Финансовый анализ", "Персональный бухгалтер"]
      },
    }),
    // Бесплатные приложения - планы
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[2].id, slug: "free" } },
      update: {},
      create: { 
        appId: apps[2].id, 
        name: "Бесплатный", 
        slug: "free", 
        price: 0,
        yearlyPrice: 0,
        oneTimePrice: 0,
        description: "Базовая аналитика для малого бизнеса.",
        features: ["Дашборды", "Основные отчеты", "До 5 пользователей", "Экспорт в Excel"]
      },
    }),
    prisma.plan.upsert({
      where: { appId_slug: { appId: apps[4].id, slug: "free" } },
      update: {},
      create: { 
        appId: apps[4].id, 
        name: "Бесплатный", 
        slug: "free", 
        price: 0,
        yearlyPrice: 0,
        oneTimePrice: 0,
        description: "Управление задачами для небольших команд.",
        features: ["Доска Канбан", "До 10 задач", "Комментарии", "Фильтры"]
      },
    }),
  ])
  console.log("Created plans")

  // Скриншоты добавляются в админке

  // Создаем статьи блога
  await Promise.all([
    prisma.post.upsert({
      where: { slug: "welcome" },
      update: {},
      create: {
        title: "Добро пожаловать на DevTrust!",
        slug: "welcome",
        content: "Мы рады приветствовать вас на платформе DevTrust — магазине бизнес-приложений.\n\nЗдесь вы найдете лучшие инструменты для вашего бизнеса:\n- CRM системы\n- Документооборот\n- Аналитика\n- Бухгалтерия\n\nВсе приложения доступны по подписке. Начните бесплатно!",
        excerpt: "Мы рады приветствовать вас на платформе DevTrust",
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: postCategories[0].id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "crm-released" },
      update: {},
      create: {
        title: "Релиз CRM Core 2.0",
        slug: "crm-released",
        content: "Мы выпустили новую версию CRM Core 2.0!\n\n## Что нового:\n- Новая доска сделок\n- Автоматизации\n- Интеграции с email\n- Мобильное приложение",
        excerpt: "Вышла новая версия популярной CRM",
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: postCategories[1].id,
      },
    }),
  ])
  console.log("Created posts")

  // Создаем админа
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@devtrust.ru" },
    update: {},
    create: {
      email: "admin@devtrust.ru",
      name: "Администратор",
      password: hashedPassword,
      isVerified: true,
    },
  })
  console.log("Created admin user")

  // Создаем тестового пользователя
  const userPassword = await bcrypt.hash("user1234", 12)
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.ru" },
    update: {},
    create: {
      email: "test@test.ru",
      name: "Тестовый Пользователь",
      password: userPassword,
      isVerified: true,
    },
  })
  console.log("Created test user")

  // Создаем организацию для тестового пользователя
  const org = await prisma.organization.upsert({
    where: { slug: "test-company" },
    update: {},
    create: {
      name: "Тестовая Компания",
      slug: "test-company",
      inn: "1234567890",
    },
  })

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: testUser.id, organizationId: org.id } },
    update: {},
    create: {
      userId: testUser.id,
      organizationId: org.id,
      role: "OWNER",
    },
  })
  console.log("Created test organization")

  // Создаем промокод
  await prisma.promoCode.upsert({
    where: { code: "WELCOME20" },
    update: {},
    create: {
      code: "WELCOME20",
      discount: 20,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: 100,
    },
  })
  console.log("Created promo code")

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })