# @devtrust/audit-log

Сервис аудита действий для платформы DevTrust.

## Что это?

Пакет предоставляет единый журнал аудита всех действий, совершаемых в платформе
и подключённых приложениях. Он автоматически записывает: **кто**, **когда**,
**где** (в каком приложении) и **что именно** сделал.

Для B2B-платформы это не просто фича, а требование безопасности и комплаенса
(SOC 2, ISO 27001, GDPR).

## Возможности

- 📝 Автоматическая запись всех мутаций (создание, обновление, удаление)
- 🔍 Полнотекстовый поиск по логам с фильтрацией
- 📊 Агрегация и отчёты по действиям пользователей
- 🔔 Алерты на подозрительную активность
- 📦 Изоляция логов по приложениям
- 🌐 Экспорт в SIEM-системы (Splunk, Elastic)
- ⏱ Настраиваемый срок хранения (retention policy)

## Быстрый старт

### 1. Логирование действий из внешнего приложения

```typescript
import { AuditLogger } from '@devtrust/audit-log';

const audit = new AuditLogger({
  appId: 'task-manager',
  platformUrl: 'https://mycompany.devtrust.ru',
  sessionToken: 'user-session-jwt',
});

// Записать действие
await audit.log({
  action: 'task.delete',
  resourceType: 'task',
  resourceId: 'task-456',
  details: {
    taskTitle: 'Обновить дизайн лендинга',
    projectId: 'project-12',
  },
  severity: 'warning', // 'info' | 'warning' | 'critical'
});