Отлично, теперь напишу обзорный `README.md` для всего монорепозитория `packages/`. Это будет точка входа для разработчиков, объясняющая назначение каждого пакета и связи между ними.

---

### `packages/README.md`

```markdown
# 📦 Пакеты платформы DevTrust

Монорепозиторий содержит все пакеты, из которых состоит платформа DevTrust.
Каждый пакет решает свою задачу и может использоваться независимо.

## Карта пакетов

```
┌──────────────────────────────────────────────────────────────┐
│                     ВНЕШНЕЕ ПРИЛОЖЕНИЕ                       │
│                                                              │
│  app-template ──► @devtrust/core ◄── @devtrust/api-client    │
│       │                  ▲                    ▲              │
│       │                  │                    │              │
│       └──────────────────┘────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────┐
│                     ПЛАТФОРМА DEVTRUST                       │
│                             │                                │
│  ┌───────────┐  ┌──────────┐ │ ┌───────────┐  ┌───────────┐  │
│  │  billing  │  │  audit   │ │ │   ui-kit  │  │  search   │  │
│  │           │  │   -log   │ │ │           │  │           │  │
│  └─────┬─────┘  └─────┬────┘ │ └─────┬─────┘  └─────┬─────┘  │
│        │              │      │       │              │        │
│        └──────────────┼──────┼───────┼──────────────┘        │
│                       │      │       │                       │
│                       ▼      ▼       ▼                       │
│                   ┌─────────────────────┐                    │
│                   │     @devtrust/core   │                   │
│                   │  (типы, auth, RBAC,  │                   │
│                   │   кэш, storage, UI)  │                   │
│                   └──────────┬──────────┘                    │
│                              │                               │
│              ┌───────────────┼───────────────┐               │
│              │               │               │               │
│              ▼               ▼               ▼               │
│     ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│     │  design    │  │  feature   │  │  notifi    │           │
│     │  -system   │  │  -flags    │  │  -cations  │           │
│     └────────────┘  └────────────┘  └────────────┘           │
└──────────────────────────────────────────────────────────────┘
```

## Список пакетов

### 🔴 Фундамент (Critical Path)

| Пакет | Назначение | Кто использует |
|---|---|---|
| [`core`](./core/README.md) | Типы, SSO-авторизация, RBAC-права, кэширование Redis, S3/MinIO-хранилище, UI-обёртки (AppShell, Can, useSession), Prisma-клиент | Платформа + все внешние приложения |
| [`design-system`](./design-system/README.md) | Атомарные UI-компоненты (Button, Input, Modal, Table, Typography), токены дизайна, темизация (светлая/тёмная) | Платформа + все внешние приложения |
| [`api-client`](./api-client/README.md) | Типизированный HTTP-клиент для взаимодействия внешних приложений с API платформы | Все внешние приложения |
| [`app-template`](./app-template/README.md) | Шаблон для создания нового внешнего приложения (React + TypeScript + сборка UMD-бандла) | Разработчики новых приложений |

### 🟡 Бизнес-логика (Core Business)

| Пакет | Назначение | Кто использует |
|---|---|---|
| [`ui-kit`](./ui-kit/README.md) | Бизнес-компоненты (UserAvatar, PermissionGate, FileUploader, NotificationBell, DataTable, AppNavigation) | Платформа + внешние приложения |
| [`billing`](./billing/README.md) | Тарифные планы, подписки, лимиты, счета, интеграция с платёжными шлюзами (Stripe, ЮKassa) | Платформа |
| [`notifications`](./notifications/README.md) | Единый сервис уведомлений: in-app, email, WebSocket/SSE, push, группировка, дайджесты | Платформа + внешние приложения |
| [`audit-log`](./audit-log/README.md) | Журнал аудита всех действий: кто, когда, где и что сделал. Экспорт в SIEM, алерты | Платформа |

### 🟢 Инфраструктура (Platform Features)

| Пакет | Назначение | Кто использует |
|---|---|---|
| [`search`](./search/README.md) | Полнотекстовый поиск по всем сущностям платформы (задачи, документы, счета, контакты) | Платформа + внешние приложения |
| [`feature-flags`](./feature-flags/README.md) | Постепенный rollout фич, A/B-тестирование, таргетинг по пользователям/компаниям | Платформа + внешние приложения |

## Взаимодействие пакетов

### Уровни зависимостей

```
Уровень 0 (нет зависимостей):
  design-system

Уровень 1 (зависит от design-system):
  core

Уровень 2 (зависит от core):
  api-client
  ui-kit (зависит от core + design-system)

Уровень 3 (зависит от core + ui-kit):
  billing
  audit-log
  notifications
  search
  feature-flags

Уровень 4 (зависит от всего):
  app-template (зависит от core + api-client + ui-kit + design-system)
  apps/web (основное приложение, использует все пакеты)
```

### Как внешнее приложение использует пакеты

```typescript
// package.json внешнего приложения
{
  "dependencies": {
    "@devtrust/core": "^1.0.0",           // AppShell, useSession, типы
    "@devtrust/api-client": "^1.0.0",      // HTTP-клиент к платформе
    "@devtrust/design-system": "^1.0.0",   // Базовые UI-компоненты
    "@devtrust/ui-kit": "^1.0.0"           // Бизнес-компоненты
  }
}
```

```tsx
// Корневой компонент внешнего приложения
import { AppShell, Can, useSession } from '@devtrust/core';
import { DevTrustClient } from '@devtrust/api-client';
import { Container, Button } from '@devtrust/design-system';
import { FileUploader, DataTable } from '@devtrust/ui-kit';
import { manifest } from './manifest';

export default function App() {
  return (
    <AppShell manifest={manifest}>
      <Container>
        <Can I="task.create">
          <Button variant="primary">Создать задачу</Button>
        </Can>

        <DataTable
          data={tasks}
          columns={columns}
        />
      </Container>
    </AppShell>
  );
}
```

## Разработка

### Установка всех зависимостей

```bash
pnpm install
```

### Сборка всех пакетов

```bash
pnpm build
```

### Сборка конкретного пакета

```bash
pnpm --filter @devtrust/core build
pnpm --filter @devtrust/api-client build
```

### Запуск тестов

```bash
pnpm test
pnpm --filter @devtrust/core test
```

### Линтинг и проверка типов

```bash
pnpm lint
pnpm typecheck
```

## Создание нового пакета

1. Скопировать структуру ближайшего по типу пакета

2. Настроить `package.json`:
```json
{
  "name": "@devtrust/new-package",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "dependencies": {
    "@devtrust/core": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

3. Настроить `tsconfig.json` (наследовать от корневого)

4. Добавить в `pnpm-workspace.yaml` (уже должен быть `packages/*`)

5. Написать `README.md` по образцу существующих

## Принципы проектирования

1. **Единая ответственность** — каждый пакет решает одну задачу
2. **Слабые связи** — минимум зависимостей между пакетами
3. **Публичное API** — каждый пакет экспортирует только то, что нужно потребителям
4. **Обратная совместимость** — ломающие изменения только в мажорных версиях
5. **Типизация** — всё на TypeScript, никаких `any`


