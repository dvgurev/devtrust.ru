# DevTrust — Запуск через Docker

## Команды запуска

### Разработка (с полными сидами)
Создает админа, тестового пользователя, категории, приложения, планы, статьи блога.

**Windows:**
```cmd
start-dev.bat
```

**Linux/Mac:**
```bash
bash start-dev.sh
```

### Продакшен (только админ)
Создает только администратора.

**Windows:**
```cmd
start-prod.bat
```

**Linux/Mac:**
```bash
bash start-prod.sh
```

---

## Что создается в каждом режиме

### Development (`seed.ts`)
- ✅ Админ: `admin@devtrust.ru` / `admin123`
- ✅ Тестовый пользователь: `test@test.ru` / `user1234`
- ✅ Тестовая организация
- ✅ Категории приложений (CRM, Документы, Аналитика, Бухгалтерия, Задачи)
- ✅ 5 приложений с планами подписки
- ✅ Статьи блога
- ✅ Промокод `WELCOME20`

### Production (`seed-prod.ts`)
- ✅ Админ: `admin@devtrust.ru` / `admin123`

---

## Сервисы

| Сервис | URL | Описание |
|--------|-----|----------|
| Web | http://localhost:3000 | Основное приложение |
| MinIO Console | http://localhost:9001 | S3-совместимое хранилище |
| PostgreSQL | localhost:5432 | База данных |
| Redis | localhost:6379 | Кэш/Rate limiting |

---

## Полезные команды

```bash
# Логи (dev)
docker-compose -f docker-compose.dev.yml logs -f

# Логи (prod)
docker-compose logs -f

# Перезапуск после изменений (dev)
docker-compose -f docker-compose.dev.yml up --build -d

# Перезапуск после изменений (prod)
docker-compose up --build -d

# Остановка (dev)
docker-compose -f docker-compose.dev.yml down

# Остановка (prod)
docker-compose down

# Сброс БД (удаление томов)
docker-compose down -v
```

---

## Переменные окружения

Отредактируйте `.env` файл:
- `AUTH_SECRET` — сгенерируйте: `openssl rand -base64 32`
- `STRIPE_*` — ключи из Stripe Dashboard
- `RESEND_API_KEY` — из Resend Dashboard (или пусто)
