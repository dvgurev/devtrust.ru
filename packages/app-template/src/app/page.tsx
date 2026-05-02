import { getCurrentUser, getOrganization } from "@platform/core"

export default async function HomePage() {
  const user = await getCurrentUser()
  const org = await getOrganization()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Внешнее приложение</h1>

        <div className="bg-gray-100 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Данные пользователя</h2>
          {user ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Пользователь не авторизован</p>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg p-6 space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Организация</h2>
          {org ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(org, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Организация не выбрана</p>
          )}
        </div>

        <div className="mt-6">
          <a
            href={process.env.PLATFORM_URL || "https://devtrust.ru"}
            className="text-blue-600 hover:underline"
          >
            ← Вернуться в магазин
          </a>
        </div>
      </div>
    </main>
  )
}