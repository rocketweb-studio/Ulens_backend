# Текущая реализация с использованием RabbitMq

## Есть основной модуль rabbit который находится в /libs

```
libs/rabbit/src/
├── index.ts              # Экспорты
├── rabbit.module.ts      # Глобальный модуль, который импортируется в нужные микросервисы
├── rabbit.event-bus.ts   # EventBus интерфейс и реализация
├── rabbit.setup.ts       # Настройка очередей с retry/DLQ
├── rabbit.constants.ts   # Константы (exchanges, queues, events)
```
Файл `rabbit.setup.ts` содержит функцию `setupQueueWithRetryAndDLQ` которая при вызове создает и настраивает очередь с retry/DLQ. Вызывается в микросервисах в consumer-ax.

## Каждый микросервис который использует RabbitMq и паттерны outbox/inbox содержит внутри 2 дополнительных модуля:
### 1. [microservice]-rabbit
- `[microservice]-rabbit.module.ts` - **основной модуль**, содержащий consumer и publisher для текущего микросервиса. Не путать с RabbitModule который служит просто для подключения брокера.
- `[microservice]-rabbit.consumer.ts` - consumer текущего микросервиса. Настраивает свои очереди, путем вызова `setupQueueWithRetryAndDLQ` из `/libs/rabbit.setup.ts`. **Получает и обрабатывает** сообщения. Сохраняет события в `inbox` если нужно.
- `[microservice]-rabbit.publisher.ts` - publisher, который **отправляет** сообщения. Содержит внутри `Cron`, который каждые 5 секунд пробегает по `outbox` таблице и проверяет наличие событие в `PENDING` статусе, еслит они есть, отправляет в брокер.

### 2. event-store
По сути стандартный модуль, который содержит внутри сервисы и репозитории для работы с таблицами `outbox` и/или `inbox`.


