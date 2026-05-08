# @devtrust/search

Сервис полнотекстового поиска платформы DevTrust.

## Что это?

Единый поисковый движок, который индексирует данные из всех подключённых
приложений и предоставляет быстрый полнотекстовый поиск с фильтрацией.
Пользователь может в одном поле найти и задачу, и документ, и счёт, и контакт.

Для B2B-платформы это критически важная фича: когда у компании десятки
тысяч сущностей в разных приложениях, без единого поиска — хаос.

## Возможности

- 🔍 Мгновенный полнотекстовый поиск по всем приложениям
- 🏷 Автоматическая индексация сущностей приложений
- 🎯 Ранжирование результатов по релевантности
- 🔬 Фильтрация по приложению, типу сущности, дате
- ✨ Подсветка совпадений в результатах
- 📊 Типизированные результаты (Task, Document, Invoice, Contact)
- 🔐 Учёт прав доступа — пользователь видит только то, к чему имеет доступ
- 🌐 Локализация (русская морфология)
- ⚡ Поиск по мере ввода (debounced, от 2 символов)

## Быстрый старт

### 1. Регистрация индекса приложения

В манифесте приложения объявляются типы сущностей для индексации:

```typescript
// manifest.ts
import type { AppManifest, SearchIndexConfig } from '@devtrust/core/types';

export const manifest: AppManifest = {
  id: 'task-manager',
  name: 'Менеджер задач',
  // ...

  // Конфигурация поисковых индексов
  searchIndexes: [
    {
      entityType: 'task',
      displayName: 'Задачи',
      searchableFields: ['title', 'description', 'assigneeName'],
      filterableFields: ['status', 'priority', 'projectId'],
      resultComponent: 'TaskSearchResult', // компонент для отображения
      permission: 'task.read',             // право для доступа к результатам
    },
    {
      entityType: 'project',
      displayName: 'Проекты',
      searchableFields: ['name', 'description'],
      filterableFields: ['status'],
      resultComponent: 'ProjectSearchResult',
      permission: 'project.read',
    },
  ],
};