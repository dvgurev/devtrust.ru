# 📱 Приложения платформы DevTrust

Директория содержит запускаемые приложения монорепозитория. В отличие
от пакетов (`packages/`), приложения имеют точки входа, роутинг
и деплой-конфигурацию.

## Структура
apps/
└── web/ # Основное веб-приложение платформы

text

## apps/web

Основное веб-приложение платформы на **Next.js (App Router)**.
Единая точка входа для всех пользователей и хаб для подключения
внешних приложений.

### Технологии

| Технология | Назначение |
|---|---|
| Next.js 14 (App Router) | Фреймворк, роутинг, SSR/SSG |
| React 18 | UI-библиотека |
| TypeScript | Типизация |
| Prisma | ORM для PostgreSQL |
| NextAuth.js (или кастомный SSO) | Аутентификация |
| Tailwind CSS | Стили (через `design-system`) |
| Turbo | Оркестрация сборки |

### Ключевые функции

- 🔐 **Аутентификация** — логин, регистрация, восстановление пароля (SSO)
- 🏠 **Дашборд** — главная страница после входа с bottom-nav (судя по последнему коммиту)
- 🧩 **Хаб приложений** — каталог и динамическая загрузка внешних приложений
- ⚙️ **Админ-панель** — управление пользователями, ролями, компаниями
- 🌐 **API платформы** — все API-роуты для `@devtrust/api-client`
- 📥 **Загрузчик приложений** — рантайм-подгрузка UMD-бандлов внешних приложений

### Структура проекта
apps/web/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Страницы аутентификации
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (dashboard)/ # Защищённые страницы
│ │ │ ├── layout.tsx # Шелл с боковым меню
│ │ │ ├── page.tsx # Главный дашборд
│ │ │ │
│ │ │ ├── apps/ # Управление приложениями
│ │ │ │ ├── page.tsx # Каталог приложений
│ │ │ │ └── [appId]/ # Динамическая загрузка приложения
│ │ │ │ └── [...path]/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── admin/ # Админ-панель
│ │ │ │ ├── users/
│ │ │ │ ├── roles/
│ │ │ │ ├── apps/
│ │ │ │ └── billing/
│ │ │ │
│ │ │ └── settings/ # Настройки профиля
│ │ │
│ │ ├── api/ # API-роуты платформы
│ │ │ ├── auth/
│ │ │ │ ├── login/
│ │ │ │ ├── register/
│ │ │ │ └── session/
│ │ │ ├── users/
│ │ │ ├── apps/
│ │ │ │ └── [appId]/
│ │ │ │ ├── files/
│ │ │ │ └── permissions/
│ │ │ ├── files/
│ │ │ ├── billing/
│ │ │ └── search/
│ │ │
│ │ └── layout.tsx # Корневой layout
│ │
│ ├── components/ # Компоненты приложения
│ │ ├── ui/ # UI-компоненты (на основе design-system)
│ │ ├── app-loader.tsx # Динамический загрузчик внешних приложений
│ │ ├── dashboard-bottom-nav.tsx # Нижняя навигация (последний фикс)
│ │ └── shell.tsx # Оболочка платформы
│ │
│ ├── lib/ # Утилиты приложения
│ │ ├── prisma.ts # Prisma-клиент
│ │ ├── auth.ts # Конфигурация аутентификации
│ │ └── registry.ts # Реестр внешних приложений
│ │
│ └── middleware.ts # Next.js middleware (защита роутов)
│
├── public/ # Статические файлы
├── .env.local # Локальные переменные окружения
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json

text

### Переменные окружения

Скопировать `.env.example` из корня:

```bash
cp .env.example apps/web/.env.local
Переменная	Описание
DATABASE_URL	Строка подключения к PostgreSQL
REDIS_URL	Адрес Redis
MINIO_ENDPOINT	Endpoint MinIO
MINIO_ACCESS_KEY	Access key MinIO
MINIO_SECRET_KEY	Secret key MinIO
MINIO_BUCKET	Название бакета
JWT_SECRET	Секрет для JWT-токенов
PLATFORM_URL	URL платформы (по умолч. http://localhost:3000)
Сценарии запуска
bash
# Режим разработки
pnpm dev

# Сборка
pnpm build

# Продакшен
pnpm --filter web start
Как работает загрузка внешних приложений?
Внешнее приложение (из отдельного репозитория) собирается в UMD-бандл
и публикуется на свой хостинг. Платформа хранит в БД запись о приложении
с URL его бандла. Когда пользователь переходит по /apps/[appId]/*,
платформа динамически загружает бандл и монтирует его в AppShell.

typescript
// src/app/(dashboard)/apps/[appId]/[...path]/page.tsx
import dynamic from 'next/dynamic';
import { getAppRegistration } from '@/lib/registry';

export default async function AppPage({ params }) {
  const { appId } = params;
  const registration = await getAppRegistration(appId);

  const AppComponent = dynamic(
    () => import(/* webpackIgnore: true */ registration.bundleUrl),
    {
      ssr: false,
      loading: () => <AppLoader />,
    }
  );

  return (
    <AppShell appId={appId}>
      <AppComponent />
    </AppShell>
  );
}
Добавление нового приложения в монорепозиторий
Если в будущем нужно добавить служебное приложение внутрь монорепозитория
(например, админ-панель или лендинг):

bash
# Создать директорию
mkdir apps/admin

# Инициализировать package.json
cd apps/admin
pnpm init

# Настроить как workspace-пакет
# package.json должен иметь name: "@devtrust/admin"
json
// turbo.json — добавить в pipeline
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    }
  }
}