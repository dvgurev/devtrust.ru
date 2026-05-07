# DevTrust — Платформа бизнес-приложений по подписке

Монорепозиторий на базе Turborepo + pnpm workspaces.

## Требования

- **Node.js** >= 18
- **pnpm** >= 10 (`npm i -g pnpm`)
- **PostgreSQL** (локальная служба)
- **Redis** (локальная служба, например Memurai)
- **MinIO** (локальная служба, S3-совместимое хранилище)

## Установка служб (Windows)

### PostgreSQL
```powershell
winget install PostgreSQL.PostgreSQL
```
Запуск службы:
```powershell
sc start postgresql-x64-17
```

### Redis (Memurai)
```powershell
winget install Memurai.Memurai
```
Или скачать: https://www.memurai.com/

### MinIO
Скачать `minio.exe`: https://min.io/download#/windows

Запуск как службы:
```powershell
New-Service -Name "MinIO" -BinaryPathName "C:\path\to\minio.exe server D:\minio-data" -StartupType Automatic
sc start MinIO
```

## Установка зависимостей

```bash
pnpm install
```

## Настройка окружения

Скопируйте `.env.example` в `.env.local` для нужных приложений и заполните переменные:

```bash
cp .env.example apps/web/.env.local
```

Основные переменные:
- `DATABASE_URL` — строка подключения к PostgreSQL
- `REDIS_URL` — адрес Redis
- `MINIO_*` — настройки MinIO (endpoint, access key, secret)

## Запуск для разработки (Dev)

Убедитесь, что службы PostgreSQL, Redis, MinIO запущены, затем:

```bash
pnpm dev
```

Turbo запустит все приложения в режиме разработки. Основное приложение доступно по адресу `http://localhost:3000`.

## Сборка и запуск для продакшена (Prod)

### Сборка всех пакетов и приложений:
```bash
pnpm build
```

### Запуск продакшен-версии:
```bash
pnpm --filter web start
```

Или вручную:
```bash
cd apps/web
pnpm start
```

## Структура монорепозитория

- `apps/web` — основной веб-интерфейс платформы
- `packages/core` — общие утилиты, типы, SSO-авторизация
- `packages/app-template` — шаблон для внешних приложений
- `design-system` — дизайн-система и компоненты
- `ui-kit` — UI-компоненты

## Полезные команды

```bash
pnpm lint        # Проверка кода линтером
pnpm typecheck   # Проверка типов TypeScript
pnpm clean       # Очистка кэша turbo и сборок
pnpm build:core  # Сборка только пакета @platform/core
```

## Лицензия

Private
