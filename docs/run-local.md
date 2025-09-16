# Локальный запуск приложения

Для локального запуска приложения нужно следовать следующим шагам:

## 1. Установка зависимостей
```bash
yarn
```

## 2. Настройка переменных окружения
Указать ENV-переменные в `.env.development.local` по образцу из `.env.example`

## 3. Сборка библиотек
```bash
yarn build:libs
```

## 4. Запуск баз данных
Запустить необходимые базы данных для Auth, Main, Files, Payments микросервисов.

## 5. Запуск Rabbit и Redis
Для быстрого запуска Rabbit и Redis использовать docker.

Redis:
`cd /libs/redis/`
`docker compose up -d`

Rabbit:
`cd /libs/rabbit/`
`docker compose up -d`

## 6. Запуск микросервисов
Запустить каждый микросервис и gateway командой:

### Gateway (точка входа)
```bash
yarn start:dev:gateway
```

### Auth микросервис
```bash
yarn start:dev:auth
```

### Main микросервис
```bash
yarn start:dev:main
```

### Payments микросервис
```bash
yarn start:dev:payments
```

### Notifications микросервис
```bash
yarn start:dev:notifications
```

### Files микросервис
```bash
yarn start:dev:files
```

## Примечания
- Все сервисы запускаются в режиме разработки с автоперезагрузкой
- Убедитесь, что все необходимые переменные окружения настроены корректно
- Для работы с базой данных может потребоваться выполнить миграции