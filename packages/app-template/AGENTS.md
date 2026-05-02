# App Template

Шаблон для создания внешних приложений на DevTrust Platform.

## Быстрый старт

```bash
# Скопируйте шаблон
cp -r packages/app-template products/my-app
cd products/my-app

# Переименуйте
mv app-template my-app
# Обновите name в package.json на @platform/my-app

# Установите зависимости
pnpm install

# Запустите
pnpm dev
```

## Конфигурация

Создайте `.env.local`:

```env
# URL платформы (магазина)
PLATFORM_URL=https://devtrust.ru

# App ID из админки платформы (для проверки доступа)
NEXT_PUBLIC_APP_ID=...
```

## SSO Авторизация

Приложение использует `@platform/core` для авторизации:

```typescript
import { getCurrentUser, getOrganization } from "@platform/core"

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) {
    // Редирект на SSO вход
    redirect(`${process.env.PLATFORM_URL}/sso/login?app=my-app&redirect=${encodeURIComponent(request.url)}`)
  }

  const org = await getOrganization()
  // ...
}
```

## Проверка доступа

```typescript
import { checkAccess } from "@platform/core"

const { allowed } = await checkAccess("my-app")
if (!allowed) {
  redirect(`${process.env.PLATFORM_URL}/catalog/my-app`)
}
```

## Структура

```
src/
├── app/           # Next.js App Router страницы
│   ├── layout.tsx
│   └── page.tsx
├── lib/           # Утилиты (добавьте свои)
└── components/    # UI компоненты
```