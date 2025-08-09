## Общие скрипты

**`build`** - Сборка всех приложений проекта
**`format`** - Форматирование кода с помощью Prettier для всех TypeScript файлов в apps/ и libs/
**`start`** - Запуск приложения по умолчанию
**`build:libs`** - Сборка всех библиотек проекта (libs/tsconfig.libs.json)
**`lint`** - Проверка и исправление кода с помощью ESLint для всех TypeScript файлов
**`test`** - Запуск всех unit тестов
**`test:watch`** - Запуск тестов в режиме наблюдения (автоматический перезапуск при изменениях)
**`test:cov`** - Запуск тестов с генерацией отчета о покрытии кода
**`test:debug`** - Запуск тестов в режиме отладки с использованием Node.js inspector

## Скрипты микросервисов(на примере auth)

**`build:auth`** - Сборка auth микросервиса
**`start:auth`** - Запуск auth в production режиме (dist/apps/auth/main)
**`start:dev:auth`** - Запуск auth в development режиме с автоперезагрузкой
**`test:e2e:auth`** - Запуск E2E тестов для auth микросервиса (apps/auth/test/jest-e2e.json)

## Prisma команды (Auth микросервис)

**`prisma:studio:auth`** - Запуск Prisma Studio для просмотра и редактирования данных auth базы
**`prisma:push:auth`** - Принудительная синхронизация схемы с базой данных auth
**`prisma:generate:auth`** - Генерация Prisma Client для auth микросервиса
**`prisma:migrateDev:auth`** - Создание и применение новой миграции для auth базы данных
**`prisma:migrateReset:auth`** - Сброс базы данных auth и применение всех миграций заново
**`prisma:migrateDeploy:auth`** - Применение миграций в production окружении для auth