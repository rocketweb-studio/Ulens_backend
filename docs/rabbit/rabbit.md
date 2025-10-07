# RabbitMQ в проекте Ulens - Полное руководство

## Содержание
1. [Что такое RabbitMQ и зачем он нужен](#что-такое-rabbitmq-и-зачем-он-нужен)
2. [Основные концепции и терминология](#основные-концепции-и-терминология)
3. [Архитектура RabbitMQ в нашем проекте](#архитектура-rabbitmq-в-нашем-проекте)
4. [Настройка и запуск RabbitMQ](#настройка-и-запуск-rabbitmq)
5. [Структура кода в проекте](#структура-кода-в-проекте)
6. [Паттерн Outbox (гарантированная публикация)](#паттерн-outbox-гарантированная-публикация)
7. [Паттерн Inbox (идемпотентность)](#паттерн-inbox-идемпотентность)
8. [EventBus и методы публикации](#eventbus-и-методы-публикации)
9. [Настройка очередей с Retry и DLQ](#настройка-очередей-с-retry-и-dlq)
12. [Лучшие практики](#лучшие-практики)

## Что такое RabbitMQ и зачем он нужен

**RabbitMQ** — это брокер сообщений (message broker), который позволяет различным частям приложения общаться между собой асинхронно. Представьте его как почтовую службу для ваших микросервисов.

### Зачем нам RabbitMQ в микросервисной архитектуре?

1. **Асинхронность**: Сервисы не ждут друг друга — отправил сообщение и работай дальше
2. **Надежность**: Сообщения не потеряются, даже если один из сервисов упал
3. **Масштабируемость**: Можно добавлять новые обработчики сообщений
4. **Развязка**: Сервисы не знают друг о друге напрямую

### Пример из жизни
Когда пользователь покупает премиум-подписку:
1. **Payments-сервис** обрабатывает платеж
2. Отправляет сообщение "платеж прошел успешно" в RabbitMQ
3. **Auth-сервис** получает это сообщение и активирует премиум для пользователя
4. Отправляет обратно сообщение "премиум активирован"
5. **Payments-сервис** получает подтверждение и закрывает транзакцию

## Основные концепции и терминология

### Producer (Производитель)
Сервис, который **отправляет** сообщения. В нашем случае это может быть payments-сервис, отправляющий событие о успешном платеже.

### Consumer (Потребитель) 
Сервис, который **получает и обрабатывает** сообщения. Например, auth-сервис, который обрабатывает события о платежах.

### Queue (Очередь)
Место, где **хранятся сообщения** до их обработки. Как почтовый ящик — сообщения складываются туда и ждут, пока их заберут.

### Exchange (Точка обмена)
**"Умный почтальон"**, который решает, в какую очередь отправить сообщение на основе правил маршрутизации.

### Routing Key (Ключ маршрутизации)
**"Адрес на конверте"** — строка, которая помогает Exchange понять, куда доставить сообщение.
Примеры: `payment.succeeded`

### Binding (Привязка)
**Правило**, которое связывает Exchange с Queue. Например: "все сообщения с ключом `payment.*` отправляй в очередь `auth.payments.q`"

### Channel (Канал)
**"Соединение"** между вашим приложением и RabbitMQ. Через канал отправляются и получаются сообщения.

### Dead Letter Queue (DLQ)
**"Больничка для сообщений"** — место, куда попадают сообщения, которые не удалось обработать после нескольких попыток.

## Архитектура RabbitMQ в нашем проекте

### Общая архитектура

В нашем проекте RabbitMQ используется для асинхронного обмена сообщениями между микросервисами:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Payments      │    │      Auth       │    │ Notifications   │
│   Service       │    │    Service      │    │    Service      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RabbitMQ Broker                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   app.events    │  │    app.dlx      │  │   Retry Queues  │ │
│  │   (topic)       │  │   (topic)       │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Основные компоненты

1. **RabbitModule** - глобальный модуль, который настраивает соединение и каналы
2. **EventBus** - интерфейс для публикации событий с двумя методами
3. **Outbox Pattern** - гарантирует доставку сообщений через базу данных
4. **Inbox Pattern** - обеспечивает идемпотентность обработки сообщений
5. **Retry + DLQ** - автоматические повторы и обработка неудачных сообщений

## Настройка и запуск RabbitMQ

### Переменные окружения

```bash
# URL подключения к RabbitMQ
RMQ_URL=amqp://username:password@localhost:5672
```

## Структура кода в проекте

### Библиотека RabbitMQ (`libs/rabbit/`)

```
libs/rabbit/src/
├── index.ts              # Экспорты
├── rabbit.module.ts      # Глобальный модуль
├── rabbit.event-bus.ts   # EventBus интерфейс и реализация
├── rabbit.setup.ts       # Настройка очередей с retry/DLQ
├── rabbit.constants.ts   # Константы (exchanges, queues, events)
└── rmq-ping.ts          # Проверка соединения
```

## Паттерн Outbox (гарантированная публикация)

### Проблема
В распределенных системах сложно гарантировать, что событие будет опубликовано в RabbitMQ после успешного сохранения в базе данных. Если процесс упадет между сохранением в БД и публикацией в RabbitMQ, событие будет потеряно.

### Решение - Outbox Pattern

1. **Сохранение в БД**: Событие сохраняется в таблицу `outbox_events` в той же транзакции, что и основная бизнес-логика
2. **Фоновая публикация**: Отдельный процесс (Publisher) читает события из БД и публикует их в RabbitMQ
3. **Статусы событий**: `PENDING` → `PUBLISHED` или `FAILED` с retry логикой

### Пример использования

```typescript
// В сервисе (например, PaymentsService)
async processPayment(paymentData: PaymentData) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Сохраняем основную бизнес-логику
    const transaction = await tx.transaction.create({
      data: paymentData
    });

    // 2. Сохраняем событие в outbox в той же транзакции
    await this.outboxService.createOutboxEvent({
      eventType: RabbitEvents.PAYMENT_SUCCEEDED,
      payload: {
        sessionId: transaction.sessionId,
        userId: transaction.userId,
        planId: transaction.planId,
        // ...
      }
    });

    return transaction;
  });
}
```

### Publisher (фоновый процесс)

```typescript
@Injectable()
export class PaymentsRabbitPublisher {
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    await this.publishPendingOnce();
  }

  async publishPendingOnce(chunkSize = 50): Promise<void> {
    const events = await this.outboxService.findPendingOutboxEvents(chunkSize);
    
    for (const event of events) {
      try {
        // Публикуем с подтверждением доставки
        await this.bus.publishConfirm(
          RabbitExchanges.APP_EVENTS,
          event.eventType,
          event.payload,
          { headers: event.headers }
        );
        
        // Помечаем как опубликованное
        await this.outboxService.updateOutboxPublishedEvent(event.id);
      } catch (error) {
        // Обрабатываем ошибку с exponential backoff
        await this.outboxService.updateOutboxFailedEvent(event.id, nextAttempt);
      }
    }
  }
}
```

## Паттерн Inbox (идемпотентность)

### Проблема
Сообщения могут приходить повторно из-за:
- Retry механизмов
- Повторной публикации из Outbox
- Сетевых проблем

### Решение - Inbox Pattern

1. **Проверка дубликатов**: Перед обработкой проверяем, не обрабатывали ли мы уже это сообщение
2. **Сохранение в БД**: Сохраняем информацию о обработанном сообщении
3. **Идемпотентная обработка**: Даже при повторной доставке результат будет одинаковым

### Пример использования

```typescript
@Injectable()
export class AuthRabbitConsumer implements OnModuleInit {
  async onModuleInit() {
    await this.ch.consume(
      RabbitMainQueues.AUTH_PAYMENT_SUCCEEDED_Q,
      async (msg) => {
        if (!msg) return;
        
        try {
          const event = JSON.parse(msg.content.toString());
          
          // 1. Проверяем идемпотентность
          const existing = await this.inboxService.findInboxMessage(event.messageId);
          if (existing) {
            console.log(`Message ${event.messageId} already processed, skipping`);
            this.ch.ack(msg);
            return;
          }

          // 2. Сохраняем в inbox
          await this.inboxService.createInboxMessage({
            id: event.messageId,
            type: RabbitEvents.PAYMENT_SUCCEEDED,
            source: RabbitEventSources.PAYMENTS_SERVICE,
            payload: event
          });

          // 3. Выполняем бизнес-логику
          await this.userService.activatePremium(event.userId, event.planId);

          // 4. Отправляем ответное событие
          await this.outboxService.createOutboxEvent({
            eventType: RabbitEvents.AUTH_PREMIUM_ACTIVATED,
            payload: {
              sessionId: event.sessionId,
              userId: event.userId,
              planId: event.planId,
              // ...
            }
          });

          this.ch.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.ch.nack(msg, false, false); // Отправляем в DLQ
        }
      }
    );
  }
}
```

## EventBus и методы публикации

### Интерфейс EventBus

```typescript
export interface EventBus {
  // Базовый метод публикации (без гарантий доставки)
  publish(
    exchangeOrTopic: string,
    routingKeyOrPartitionKey: string,
    message: unknown,
    options?: { headers?: Record<string, any> }
  ): Promise<void>;

  // Метод с подтверждением доставки
  publishConfirm(
    exchangeOrTopic: string,
    routingKeyOrPartitionKey: string,
    message: unknown,
    options?: { 
      headers?: Record<string, any>; 
      mandatory?: boolean; 
      timeoutMs?: number 
    }
  ): Promise<void>;
}
```

### Различия между методами

| Метод | Гарантии | Использование |
|-------|----------|---------------|
| `publish()` | Нет гарантий доставки | Для событий, где потеря не критична |
| `publishConfirm()` | Гарантированная доставка | Для критически важных событий (платежи) |

## Настройка очередей с Retry и DLQ

### Функция setupQueueWithRetryAndDLQ

```typescript
export async function setupQueueWithRetryAndDLQ(ch: amqp.Channel, config: QueueConfig) {
  const { baseQueue, exchange, routingKey } = config;
  const retryQueue = `${baseQueue}.retry.1m`;
  const dlqQueue = `${baseQueue}.dlq`;
  const dlxExchange = RabbitExchanges.APP_DLX;

  // 1. Основная очередь с DLX
  await ch.assertQueue(baseQueue, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": dlxExchange,
      "x-dead-letter-routing-key": dlqQueue,
    },
  });
  await ch.bindQueue(baseQueue, exchange, routingKey);

  // 2. Retry очередь (TTL = 1 минута)
  await ch.assertQueue(retryQueue, {
    durable: true,
    arguments: {
      "x-message-ttl": RabbitRetryTtlMs, // 60_000 ms
      "x-dead-letter-exchange": exchange,
      "x-dead-letter-routing-key": routingKey,
    },
  });

  // 3. Dead Letter Queue
  await ch.assertQueue(dlqQueue, { durable: true });
  await ch.bindQueue(dlqQueue, dlxExchange, dlqQueue);
}
```

### Логика работы Retry + DLQ

1. **Основная очередь**: Сообщения обрабатываются нормально
2. **При ошибке**: Сообщение отправляется в retry очередь
3. **Retry очередь**: Через 1 минуту сообщение возвращается в основную очередь
4. **После 3 попыток**: Сообщение попадает в DLQ для ручного анализа


### Логирование

```typescript
// В коде используются консольные логи с префиксами
console.log(`[PAYMENTS][RMQ] Published outbox ${eventId} -> ${exchange}:${routingKey}`);
console.log(`[AUTH][RMQ] consumed event - payment.succeeded`);
console.log(`[NOTIFICATIONS][RMQ] consumed event - notification.send`);
```

## Лучшие практики

### 1. Используйте publishConfirm для критических событий

```typescript
// ✅ Хорошо - для платежей
await this.bus.publishConfirm(
  RabbitExchanges.APP_EVENTS,
  RabbitEvents.PAYMENT_SUCCEEDED,
  paymentData
);

// ✅ Можно - для уведомлений
await this.bus.publish(
  RabbitExchanges.APP_EVENTS,
  RabbitEvents.NOTIFICATION_SEND,
  notificationData
);
```

### 2. Всегда используйте идемпотентность

```typescript
// ✅ Хорошо
const existing = await this.inboxService.findInboxMessage(messageId);
if (existing) {
  this.ch.ack(msg);
  return;
}
```

### 3. Правильная обработка ошибок

```typescript
// ✅ Хорошо
try {
  await this.processBusinessLogic(event);
  this.ch.ack(msg);
} catch (error) {
  console.error('Processing error:', error);
  this.ch.nack(msg, false, false); // Отправляем в DLQ
}
```

### 4. Используйте структурированные события

```typescript
// ✅ Хорошо
interface PaymentSucceededEvent {
  messageId: string;
  sessionId: string;
  userId: string;
  planId: number;
  provider: string;
  expiresAt: string;
}
```

### 5. Настройте правильные TTL для retry

```typescript
// ✅ Хорошо - экспоненциальный backoff
const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s, 10s, 20s... max 10m
```

## Заключение

RabbitMQ — мощный инструмент для построения надежной асинхронной архитектуры. В нашем проекте он обеспечивает:

- ✅ **Надежную доставку** сообщений между микросервисами через EventBus
- ✅ **Идемпотентную обработку** через Inbox паттерн  
- ✅ **Гарантированную публикацию** через Outbox паттерн
- ✅ **Retry логику** с Dead Letter Queues и экспоненциальным backoff
- ✅ **Мониторинг и отладку** через Web UI и структурированные логи
- ✅ **Глобальную конфигурацию** через RabbitModule
- ✅ **Типизированные события** через константы и контракты

### Ключевые особенности текущей реализации:

1. **EventBus с двумя методами**: `publish()` для обычных событий и `publishConfirm()` для критически важных
2. **Outbox Pattern**: Гарантирует доставку через сохранение в БД и фоновую публикацию
3. **Inbox Pattern**: Обеспечивает идемпотентность через проверку дубликатов
4. **Автоматическая настройка**: `setupQueueWithRetryAndDLQ()` создает retry и DLQ очереди
5. **Cron-based Publisher**: Каждые 5 секунд проверяет и публикует pending события
6. **Структурированное логирование**: Префиксы `[SERVICE][RMQ]` для легкой отладки

Следуя этому руководству, вы сможете эффективно работать с RabbitMQ в проекте и понимать, как происходит обмен сообщениями между сервисами.

**Полезные ссылки:**
- [Официальная документация RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [AMQP 0-9-1 Protocol](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [RabbitMQ Patterns](https://www.rabbitmq.com/getstarted.html)
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)
- [Inbox Pattern](https://microservices.io/patterns/data/transactional-inbox.html)
