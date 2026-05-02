import Redis from "ioredis"

// Инициализация Redis клиента с fallback
let redis: any
try {
  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    retryStrategy: () => null,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  })

  redis.on("error", (err: any) => {
    console.warn("Redis connection error:", err)
    // Не заменяем клиент, чтобы избежать race condition
    // Ошибки будут обрабатываться в отдельных операциях
  })

  // Асинхронная проверка подключения (не блокирующая)
  setTimeout(async () => {
    try {
      await redis.ping()
      console.log("Redis connected successfully")
    } catch (err) {
      console.warn("Redis ping failed, operations may fail:", err)
    }
  }, 100)
} catch (error) {
  console.warn("Redis initialization failed, using stub:", error)
  // Создаем заглушку
  redis = {
    async get(key: string) {
      return null
    },
    async set(key: string, value: any, ...args: any[]) {
      return "OK"
    },
    async del(key: string) {
      return 0
    },
    async pipeline() {
      return {
        sadd: () => {},
        expire: () => {},
        async exec() {
          return []
        }
      }
    },
    async smembers(key: string) {
      return []
    },
    async keys(pattern: string) {
      return []
    }
  }
}

// Типы для кэширования
export type CacheOptions = {
  ttl?: number // Время жизни в секундах
  tags?: string[] // Теги для инвалидации
}

/**
 * Получить данные из кэша или выполнить функцию и закэшировать результат
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 60 * 5, tags = [] } = options // По умолчанию 5 минут

  // Пытаемся получить данные из кэша
  if (ttl > 0) {
    try {
      const cached = await redis.get(key)
      if (cached !== null) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.error("Redis cache get error:", error)
      // Продолжаем выполнение функции при ошибке кэша
    }
  }

  // Выполняем функцию
  const data = await fn()

  // Сохраняем в кэш
  if (ttl > 0) {
    try {
      await redis.set(key, JSON.stringify(data), "EX", ttl)

      // Сохраняем связь ключа с тегами
      if (tags.length > 0) {
        const pipeline = redis.pipeline()
        tags.forEach((tag) => {
          pipeline.sadd(`tag:${tag}`, key)
          pipeline.expire(`tag:${tag}`, ttl + 60) // Теги живут немного дольше
        })
        await pipeline.exec()
      }
    } catch (error) {
      console.error("Redis cache set error:", error)
    }
  }

  return data
}

/**
 * Инвалидировать кэш по ключу
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Redis cache delete error:", error)
  }
}

/**
 * Инвалидировать все ключи с определенным тегом
 */
export async function invalidateByTag(tag: string): Promise<void> {
  try {
    const key = `tag:${tag}`
    const keys = await redis.smembers(key)
    if (keys.length > 0) {
      await redis.del(...keys)
      await redis.del(key)
    }
  } catch (error) {
    console.error("Redis tag invalidation error:", error)
  }
}

/**
 * Инвалидировать несколько тегов
 */
export async function invalidateByTags(tags: string[]): Promise<void> {
  await Promise.all(tags.map((tag) => invalidateByTag(tag)))
}

/**
 * Генерация ключа кэша для API каталога
 */
export function catalogCacheKey(params: {
  query?: string
  category?: string
  sort?: string
  isFree?: string
  page?: number
  limit?: number
}): string {
  const { query = "", category = "", sort = "", isFree = "", page = 1, limit = 20 } = params
  return `catalog:${query}:${category}:${sort}:${isFree}:${page}:${limit}`
}

/**
 * Генерация ключа кэша для главной страницы
 */
export function homeCacheKey(): string {
  return "home:featured"
}

/**
 * Генерация ключа кэша для приложения по slug
 */
export function appCacheKey(slug: string): string {
  return `app:${slug}`
}

/**
 * Очистить весь кэш (только для разработки)
 */
export async function clearAllCache(): Promise<void> {
  try {
    const keys = await redis.keys("*")
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("Redis clear all error:", error)
  }
}