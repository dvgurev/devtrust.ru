import Redis from "ioredis"

// Состояние Redis клиента
let redisClient: any = null
let connectionPromise: Promise<any> | null = null

// Функция для получения клиента с ленивой инициализацией
async function getRedisClient() {
  // Если клиент уже есть и соединение активно, возвращаем его
  if (redisClient && redisClient.status === 'ready') {
    return redisClient
  }

  // Если инициализация уже в процессе, ждем ее
  if (connectionPromise) {
    return connectionPromise
  }

  // Создаем новый клиент
  connectionPromise = (async () => {
    try {
      const client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        retryStrategy: (times) => {
          // Повторяем подключение с задержкой, максимум 3 попытки
          if (times > 3) {
            return null
          }
          return Math.min(times * 100, 3000)
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: true,
        lazyConnect: true, // Не подключаемся сразу
      })

      // Обработчики ошибок
      client.on("error", (err: any) => {
        console.warn("Redis connection error:", err.message)
        redisClient = null
        connectionPromise = null
      })

      client.on("end", () => {
        console.warn("Redis connection closed")
        redisClient = null
        connectionPromise = null
      })

      client.on("ready", () => {
        console.log("Redis connected successfully")
      })

      // Подключаемся явно
      await client.connect()

      redisClient = client
      return client
    } catch (error) {
      console.warn("Redis initialization failed:", error)
      connectionPromise = null
      throw error
    }
  })()

  return connectionPromise
}

// Функция для безопасного выполнения Redis операций
async function safeRedisOperation<T>(
  operation: (client: any) => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const client = await getRedisClient()
    return await operation(client)
  } catch (error) {
    console.warn("Redis operation failed, using fallback:", error)
    return fallback
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
    const cachedData = await safeRedisOperation(
      async (client) => {
        const data = await client.get(key)
        return data !== null ? JSON.parse(data) : null
      },
      null
    )

    if (cachedData !== null) {
      return cachedData
    }
  }

  // Выполняем функцию
  const data = await fn()

  // Сохраняем в кэш
  if (ttl > 0) {
    await safeRedisOperation(
      async (client) => {
        await client.set(key, JSON.stringify(data), "EX", ttl)

        // Сохраняем связь ключа с тегами
        if (tags.length > 0) {
          const pipeline = client.pipeline()
          tags.forEach((tag) => {
            pipeline.sadd(`tag:${tag}`, key)
            pipeline.expire(`tag:${tag}`, ttl + 60) // Теги живут немного дольше
          })
          await pipeline.exec()
        }
      },
      null
    )
  }

  return data
}

/**
 * Инвалидировать кэш по ключу
 */
export async function invalidateCache(key: string): Promise<void> {
  await safeRedisOperation(
    async (client) => {
      await client.del(key)
    },
    null
  )
}

/**
 * Инвалидировать все ключи с определенным тегом
 */
export async function invalidateByTag(tag: string): Promise<void> {
  await safeRedisOperation(
    async (client) => {
      const key = `tag:${tag}`
      const keys = await client.smembers(key)
      if (keys && keys.length > 0) {
        await client.del(...keys)
        await client.del(key)
      }
    },
    null
  )
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
  await safeRedisOperation(
    async (client) => {
      const keys = await client.keys("*")
      if (keys && keys.length > 0) {
        await client.del(...keys)
      }
    },
    null
  )
}

// Опционально: функция для закрытия соединения (вызывать при завершении приложения)
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
    connectionPromise = null
  }
}