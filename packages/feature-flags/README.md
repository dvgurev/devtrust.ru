# @devtrust/feature-flags

Сервис управления feature-флагами платформы DevTrust.

## Что это?

Feature-флаги позволяют включать и выключать функциональность без повторного
деплоя. Можно выпустить новую фичу, скрытую за флагом, протестировать на 10%
пользователей, собрать обратную связь и только потом включить всем.

Для B2B-платформы это особенно важно: можно кастомизировать функциональность
под конкретную компанию или тарифный план.

## Возможности

- 🎚 Включение/выключение фич в реальном времени (без деплоя)
- 👥 Таргетинг по проценту пользователей (canary rollout)
- 🏢 Таргетинг по компании или тарифному плану
- 👤 Таргетинг по конкретному пользователю
- 🧪 A/B-тестирование с вариантами
- 📊 Отслеживание использования флагов
- 🔄 Синхронизация через Redis Pub/Sub
- 📦 Независимость от внешних сервисов

## Быстрый старт

### 1. Проверка флага в коде

```typescript
import { isFeatureEnabled, getFeatureVariant } from '@devtrust/feature-flags';

// Простая проверка — фича включена?
if (await isFeatureEnabled('new-dashboard', { userId: 'user-123' })) {
  return <NewDashboard />;
}
return <OldDashboard />;

// A/B-тестирование — получить вариант
const variant = await getFeatureVariant('signup-flow', { userId: 'user-123' });
// => 'control' | 'variant-a' | 'variant-b'

switch (variant) {
  case 'variant-a':
    return <SignupFlowA />;
  case 'variant-b':
    return <SignupFlowB />;
  default:
    return <SignupFlowControl />;
}