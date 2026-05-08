# @devtrust/web

Основное веб-приложение платформы DevTrust. Единая точка входа для всех
пользователей, хаб для подключения внешних приложений и API-сервер.

## Быстрый старт

### Требования

Убедись, что службы запущены (см. корневой `README.md`):

- PostgreSQL
- Redis (Memurai)
- MinIO

### Установка и запуск

```bash
# Из корня монорепозитория
pnpm install

# Копируем переменные окружения
cp .env.example apps/web/.env.local

# Запуск в режиме разработки
pnpm dev
```

Приложение доступно по адресу: **http://localhost:3000**

## Переменные окружения (`.env.local`)

```bash
# База данных
DATABASE_URL="postgresql://postgres:password@localhost:5432/devtrust"

# Redis
REDIS_URL="redis://localhost:6379"

# MinIO (S3-хранилище)
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="devtrust"
MINIO_USE_SSL="false"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# Платформа
NEXT_PUBLIC_PLATFORM_URL="http://localhost:3000"
```

## Структура проекта

```
apps/web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Публичные страницы
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Страница входа
│   │   │   ├── register/
│   │   │   │   └── page.tsx          # Регистрация
│   │   │   └── layout.tsx            # Layout для auth-страниц
│   │   │
│   │   ├── (dashboard)/              # Защищённые страницы
│   │   │   ├── layout.tsx            # Шелл платформы (сайдбар + хедер)
│   │   │   ├── page.tsx              # Главный дашборд
│   │   │   │
│   │   │   ├── apps/                 # Управление приложениями
│   │   │   │   ├── page.tsx          # Каталог доступных приложений
│   │   │   │   └── [appId]/          # Контейнер внешнего приложения
│   │   │   │       └── [...path]/
│   │   │   │           └── page.tsx  # Динамический загрузчик
│   │   │   │
│   │   │   ├── admin/                # Админ-панель
│   │   │   │   ├── page.tsx          # Обзор админки
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx      # Управление пользователями
│   │   │   │   ├── roles/
│   │   │   │   │   └── page.tsx      # Управление ролями
│   │   │   │   └── apps/
│   │   │   │       └── page.tsx      # Реестр внешних приложений
│   │   │   │
│   │   │   └── settings/             # Настройки пользователя
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                      # API-роуты
│   │   │   ├── auth/                 # Аутентификация
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── session/route.ts
│   │   │   │
│   │   │   ├── users/                # Пользователи
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── apps/                 # Управление приложениями
│   │   │   │   ├── route.ts
│   │   │   │   └── [appId]/
│   │   │   │       ├── permissions/route.ts
│   │   │   │       └── files/route.ts
│   │   │   │
│   │   │   ├── files/                # Файлы
│   │   │   │   ├── upload/route.ts
│   │   │   │   └── [fileId]/
│   │   │   │       ├── download/route.ts
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── search/               # Поиск
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Корневой layout
│   │   ├── page.tsx                  # Лендинг (если не авторизован)
│   │   └── not-found.tsx             # 404
│   │
│   ├── components/                   # Компоненты приложения
│   │   ├── shell/                    # Оболочка платформы
│   │   │   ├── sidebar.tsx           # Боковое меню
│   │   │   ├── header.tsx            # Верхняя панель
│   │   │   └── dashboard-bottom-nav.tsx # Мобильная навигация
│   │   │
│   │   ├── app-loader/               # Загрузка внешних приложений
│   │   │   ├── app-loader.tsx        # Компонент-загрузчик
│   │   │   └── app-registry.ts       # Реестр приложений
│   │   │
│   │   └── ui/                       # Специфичные UI-компоненты
│   │       ├── app-card.tsx          # Карточка приложения
│   │       └── permission-editor.tsx # Редактор прав
│   │
│   ├── lib/                          # Утилиты и сервисы
│   │   ├── prisma.ts                 # Prisma-клиент (синглтон)
│   │   ├── auth.ts                   # Конфигурация auth (JWT, сессии)
│   │   ├── redis.ts                  # Redis-клиент
│   │   └── minio.ts                  # MinIO-клиент
│   │
│   └── middleware.ts                 # Next.js Middleware (защита роутов)
│
├── prisma/
│   └── schema.prisma                 # Схема БД
│
├── public/                           # Статика
│   ├── favicon.ico
│   └── logo.svg
│
├── .env.local                        # Локальные переменные (в .gitignore)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Ключевые сценарии

### Аутентификация

Поток SSO обрабатывается в `src/app/api/auth/`. После успешного логина
создаётся JWT-сессия, которая хранится в httpOnly cookie и кэшируется
в Redis для быстрой проверки при каждом API-запросе.

```typescript
// apps/web/src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { getRedisClient } from './redis';

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Кэшируем сессию в Redis
  const redis = getRedisClient();
  await redis.set(`session:${token}`, userId, 'EX', 7 * 24 * 60 * 60);

  return token;
}
```

### Динамическая загрузка внешнего приложения

Когда пользователь переходит по `/apps/task-manager/*`, платформа:

1. Находит приложение в реестре (БД)
2. Проверяет права доступа
3. Динамически импортирует UMD-бандл приложения
4. Монтирует его внутрь `AppShell`

```typescript
// apps/web/src/components/app-loader/app-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { AppShell } from '@devtrust/core/ui';
import { useAppRegistration } from '@/hooks/use-app-registration';

export function AppLoader() {
  const { appId } = useParams<{ appId: string }>();
  const { registration, isLoading } = useAppRegistration(appId);

  if (isLoading) return <AppSkeleton />;
  if (!registration) return <AppNotFound />;

  const AppComponent = dynamic(
    () => import(/* webpackIgnore: true */ registration.bundleUrl),
    { ssr: false, loading: () => <AppLoading /> }
  );

  return (
    <AppShell appId={appId} manifest={registration.manifest}>
      <AppComponent />
    </AppShell>
  );
}
```

### Middleware для защиты роутов

```typescript
// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  // Публичные роуты — пропускаем
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Нет токена — редирект на логин
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Проверяем токен
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Команды

```bash
# Разработка
pnpm dev                     # Запуск dev-сервера (localhost:3000)

# Сборка
pnpm build                   # Продакшен-сборка

# Продакшен
pnpm start                   # Запуск собранного приложения

# Проверки
pnpm lint                    # Линтинг
pnpm typecheck               # Проверка типов TypeScript

# База данных
npx prisma generate          # Генерация Prisma-клиента
npx prisma db push           # Применение схемы к БД
npx prisma studio            # Открыть Prisma Studio
```

## Зависимости от других пакетов

```json
{
  "dependencies": {
    "@devtrust/core": "workspace:*",
    "@devtrust/design-system": "workspace:*",
    "@devtrust/ui-kit": "workspace:*",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "jose": "^5.0.0",
    "ioredis": "^5.0.0",
    "minio": "^7.0.0"
  }
}
