# RabbitMQ в проекте Ulens - Полное руководство для начинающих

## Содержание
1. [Что такое RabbitMQ и зачем он нужен](#что-такое-rabbitmq-и-зачем-он-нужен)
2. [Основные концепции и терминология](#основные-концепции-и-терминология)
3. [Архитектура RabbitMQ в нашем проекте](#архитектура-rabbitmq-в-нашем-проекте)
4. [Настройка и запуск RabbitMQ](#настройка-и-запуск-rabbitmq)
5. [Структура кода в проекте](#структура-кода-в-проекте)
6. [Паттерн Outbox](#паттерн-outbox)
7. [Паттерн Inbox (идемпотентность)](#паттерн-inbox-идемпотентность)
8. [Примеры использования](#примеры-использования)
9. [Мониторинг и отладка](#мониторинг-и-отладка)
10. [Лучшие практики](#лучшие-практики)
11. [Troubleshooting](#troubleshooting)

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
Примеры: `payment.succeeded`, `auth.user.registered.v1`

### Binding (Привязка)
**Правило**, которое связывает Exchange с Queue. Например: "все сообщения с ключом `payment.*` отправляй в очередь `auth.payments.q`"

### Channel (Канал)
**"Соединение"** между вашим приложением и RabbitMQ. Через канал отправляются и получаются сообщения.

### Dead Letter Queue (DLQ)
**"Больничка для сообщений"** — место, куда попадают сообщения, которые не удалось обработать после нескольких попыток.

## Архитектура RabbitMQ в нашем проекте

### Схема работы
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Payments    │───▶│   RabbitMQ   │───▶│    Auth     │
│ Service     │    │   Broker     │    │   Service   │
│             │◀───│              │◀───│             │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Основные Exchange в проекте

1. **`app.events`** (topic) — основной exchange для бизнес-событий
2. **`app.dlx`** (topic) — Dead Letter Exchange для "проблемных" сообщений

### Типичный поток сообщений
```
Payment Service ──▶ app.events ──▶ auth.payment.succeeded.q ──▶ Auth Service
                                          │
                                          ▼ (при ошибке)
                                   auth.payment.succeeded.q.retry.1m
                                          │
                                          ▼ (после 3 попыток)
                                   auth.payment.succeeded.q.dlq
```

## Настройка и запуск RabbitMQ

### 1. Запуск через Docker Compose

В файле `libs/rabbit/src/docker-compose.yml`:

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbit
    ports:
      - "5672:5672"      # AMQP порт для приложений
      - "15672:15672"    # Web UI для управления
    environment:
      RABBITMQ_DEFAULT_USER: "${RMQ_USER:-guest}"
      RABBITMQ_DEFAULT_PASS: "${RMQ_PASS:-guest}"
      RABBITMQ_DEFAULT_VHOST: "${RMQ_VHOST:-/}"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq  # Данные сохраняются
      - rabbitmq_log:/var/log/rabbitmq   # Логи
```

### 2. Переменные окружения

Добавьте в ваш `.env` файл:
```env
RMQ_URL=amqp://guest:guest@localhost:5672/
RMQ_USER=guest
RMQ_PASS=guest
RMQ_VHOST=/
```

### 3. Команды для запуска

```bash
# Запуск RabbitMQ
cd libs/rabbit/src
docker-compose up -d

# Проверка подключения
npm run rabbit:ping  # Использует libs/rabbit/src/rmq-ping.ts
```

### 4. Web-интерфейс

Откройте браузер: `http://localhost:15672`
- Логин: `guest`
- Пароль: `guest`

Здесь вы увидите все очереди, exchange, сообщения и статистику.

## Структура кода в проекте

### Основные файлы

```
libs/rabbit/src/
├── rabbit.module.ts        # Настройка подключения к RabbitMQ
├── rabbit.event-bus.ts     # Интерфейс для отправки сообщений
├── rmq-ping.ts            # Утилита для проверки подключения
└── docker-compose.yml     # Конфигурация Docker

apps/auth/src/core/rabbit/
├── auth.rabbit.publisher.ts  # Отправка событий из auth-сервиса
└── auth.rabbit.consumer.ts   # Получение событий в auth-сервисе

apps/payments/src/core/rabbit/
├── outbox-publisher.rabbit.service.ts  # Outbox паттерн
└── outbox-consumer.rabbit.service.ts   # Получение событий в payments
```

### Модуль RabbitModule (libs/rabbit/src/rabbit.module.ts)

Этот модуль настраивает подключение к RabbitMQ:

```typescript
@Global() // Модуль доступен во всех сервисах
@Module({
  providers: [
    {
      provide: "RMQ_CONNECTION",
      useFactory: async (configService: ConfigService) => {
        const url = configService.getOrThrow<string>("RMQ_URL");
        const conn = await amqp.connect(url);
        // Обработка ошибок подключения
        conn.on("error", (e) => console.error("[RMQ] connection error:", e.message));
        conn.on("close", () => console.error("[RMQ] connection closed"));
        return conn;
      },
    },
    {
      provide: "RMQ_CHANNEL",
      useFactory: async (conn: amqp.Connection) => {
        // Создаем confirm-канал для гарантированной доставки
        const ch = await conn.createConfirmChannel();
        
        // Создаем основные exchange
        await ch.assertExchange("app.events", "topic", { durable: true });
        await ch.assertExchange("app.dlx", "topic", { durable: true });
        
        // Ограничиваем количество необработанных сообщений
        await ch.prefetch(50);
        
        return ch;
      },
    },
  ],
  exports: ["RMQ_CONNECTION", "RMQ_CHANNEL"],
})
```

**Что здесь происходит:**
1. **Connection** — физическое подключение к RabbitMQ
2. **Channel** — виртуальное соединение для отправки/получения сообщений
3. **createConfirmChannel()** — канал с подтверждением доставки
4. **assertExchange()** — создание exchange, если их еще нет
5. **prefetch(50)** — максимум 50 необработанных сообщений одновременно

## Паттерн Outbox

**Проблема**: Что если база данных обновилась, а сообщение в RabbitMQ не отправилось? Или наоборот?

**Решение**: Паттерн Outbox — сначала сохраняем событие в БД, потом отправляем в брокер.

### Как работает Outbox в проекте

1. **Транзакция в БД** — сохраняем изменения + событие в таблицу `outbox_events`
2. **Фоновый процесс** — каждые 2 секунды читает новые события из БД
3. **Отправка в RabbitMQ** — публикует событие и помечает как `PUBLISHED`
4. **Retry логика** — если не удалось отправить, пробует еще раз с задержкой

### Таблица OutboxEvent (payments/schema.prisma)

```sql
model OutboxEvent {
  id             String       @id @default(uuid())
  aggregateType  String       # "subscription" | "transaction"
  aggregateId    String       # ID объекта, с которым связано событие
  eventType      String       # "payment.succeeded"
  payload        Json         # Данные события
  status         OutboxStatus @default(PENDING)  # PENDING/PUBLISHED/FAILED
  attempts       Int          @default(0)
  nextAttemptAt  DateTime?    # Когда пробовать еще раз
  correlationId  String       # Для трассировки
  createdAt      DateTime     @default(now())
  publishedAt    DateTime?
}
```

### Outbox Publisher (payments/outbox-publisher.rabbit.service.ts)

```typescript
@Injectable()
export class OutboxPublisherService implements OnModuleInit {
  private timer: NodeJS.Timeout | null = null;

  onModuleInit() {
    // Каждые 2 секунды проверяем новые события
    this.timer = setInterval(() => this.publishPendingOnce(), 2000);
  }

  async publishPendingOnce(chunkSize = 50): Promise<void> {
    // 1. Берем события со статусом PENDING
    const events = await this.prisma.outboxEvent.findMany({
      where: { 
        status: "PENDING",
        OR: [
          { nextAttemptAt: null }, 
          { nextAttemptAt: { lte: new Date() } }
        ]
      },
      take: chunkSize,
    });

    for (const event of events) {
      try {
        // 2. Отправляем в RabbitMQ
        await this.bus.publishConfirm(
          event.topic ?? "app.events",
          event.eventType, 
          event.payload
        );

        // 3. Помечаем как отправленное
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: "PUBLISHED", publishedAt: new Date() }
        });
      } catch (error) {
        // 4. При ошибке — планируем повтор с задержкой
        const attempts = event.attempts + 1;
        const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s, 10s, 20s...
        
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { 
            status: "FAILED", 
            nextAttemptAt: new Date(Date.now() + delaySec * 1000)
          }
        });
      }
    }
  }
}
```

## Паттерн Inbox (идемпотентность)

**Проблема**: Что если одно и то же сообщение пришло дважды? Например, пользователю дважды начислится премиум.

**Решение**: Паттерн Inbox — запоминаем ID обработанных сообщений.

### Таблица InboxMessage

```sql
model InboxMessage {
  id            String      @id         # messageId из события
  type          String                  # Тип события
  source        String                  # Откуда пришло
  payload       Json                    # Данные
  status        InboxStatus @default(RECEIVED)  # RECEIVED/PROCESSED/FAILED
  receivedAt    DateTime    @default(now())
  processedAt   DateTime?
}
```

### Как это работает в Consumer

```typescript
// В auth.rabbit.consumer.ts
await this.ch.consume("auth.payment.succeeded.q", async (msg) => {
  const event = JSON.parse(msg.content.toString());
  
  // 1. Проверяем, не обрабатывали ли мы уже это событие
  const existingMessage = await this.prisma.inboxMessage.findUnique({
    where: { id: event.messageId }
  });
  
  if (existingMessage?.status === 'PROCESSED') {
    // Уже обработано — просто подтверждаем получение
    this.ch.ack(msg);
    return;
  }

  // 2. Сохраняем событие как полученное
  await this.prisma.inboxMessage.upsert({
    where: { id: event.messageId },
    create: {
      id: event.messageId,
      type: event.type,
      source: 'payments',
      payload: event,
      status: 'RECEIVED'
    },
    update: {}
  });

  try {
    // 3. Обрабатываем событие
    await this.userRepository.activatePremium(event.userId);
    
    // 4. Помечаем как обработанное
    await this.prisma.inboxMessage.update({
      where: { id: event.messageId },
      data: { status: 'PROCESSED', processedAt: new Date() }
    });
    
    this.ch.ack(msg);
  } catch (error) {
    // При ошибке — отправляем в retry или DLQ
    // ...логика retry
  }
});
```

## Примеры использования

### 1. Отправка события "Пользователь зарегистрирован"

```typescript
// В auth.rabbit.publisher.ts
async publishUserRegistered(payload: { userId: string; email: string }) {
  const event = {
    messageId: randomUUID(),        // Уникальный ID
    traceId: randomUUID(),          // Для трассировки
    type: "auth.user.registered.v1", // Тип события
    occurredAt: new Date().toISOString(),
    producer: "auth",
    payload
  };

  await this.bus.publishConfirm(
    "app.events",                    // Exchange
    "auth.user.registered.v1",       // Routing key
    event,
    { 
      headers: { "x-service": "auth" },
      mandatory: true,               // Требуем доставки
      timeoutMs: 10000              // Таймаут 10 сек
    }
  );
}
```

### 2. Получение события о платеже

```typescript
// В auth.rabbit.consumer.ts
async onModuleInit() {
  // Создаем очередь для событий о платежах
  await this.ch.assertQueue("auth.payment.succeeded.q", {
    durable: true,  // Очередь переживет перезапуск RabbitMQ
    arguments: {
      "x-dead-letter-exchange": "app.dlx",
      "x-dead-letter-routing-key": "auth.payment.succeeded.q.dlq"
    }
  });

  // Привязываем очередь к exchange
  await this.ch.bindQueue(
    "auth.payment.succeeded.q", 
    "app.events", 
    "payment.succeeded"
  );

  // Начинаем слушать сообщения
  await this.ch.consume("auth.payment.succeeded.q", async (msg) => {
    if (!msg) return;
    
    try {
      const event = JSON.parse(msg.content.toString());
      
      // Обрабатываем событие
      await this.userRepository.applyPaymentSucceeded({
        userId: event.userId,
        planCode: event.planCode,
        transactionId: event.transactionId
      });

      console.log("[AUTH] Processed payment:", event);
      this.ch.ack(msg); // Подтверждаем обработку
      
    } catch (error) {
      // Логика retry (см. следующий раздел)
      this.handleRetry(msg, error);
    }
  });
}
```

### 3. Retry логика с Dead Letter Queue

```typescript
private handleRetry(msg: amqp.Message, error: Error) {
  const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
  
  if (retries < 3) {
    // Отправляем в retry-очередь с задержкой 1 минута
    this.ch.sendToQueue("auth.payment.succeeded.q.retry.1m", msg.content, {
      persistent: true,
      headers: { 
        ...msg.properties.headers, 
        "x-retries": retries + 1 
      }
    });
    this.ch.ack(msg); // Подтверждаем текущее сообщение
  } else {
    // После 3 попыток — в Dead Letter Queue
    this.ch.publish("app.dlx", "auth.payment.succeeded.q.dlq", msg.content, {
      persistent: true,
      headers: msg.properties.headers
    });
    this.ch.ack(msg);
    
    console.error("[AUTH] Message moved to DLQ after 3 retries:", error);
  }
}
```

## Мониторинг и отладка

### 1. Web-интерфейс RabbitMQ

Откройте `http://localhost:15672` и изучите вкладки:

- **Overview** — общая статистика
- **Connections** — активные подключения
- **Channels** — каналы
- **Exchanges** — точки обмена
- **Queues** — очереди и количество сообщений
- **Admin** — управление пользователями

### 2. Полезные команды для отладки

```bash
# Проверка подключения
npm run rabbit:ping

# Просмотр логов RabbitMQ
docker logs rabbit

# Просмотр состояния очередей
docker exec rabbit rabbitmqctl list_queues name messages

# Просмотр exchange
docker exec rabbit rabbitmqctl list_exchanges

# Очистка очереди (ОСТОРОЖНО!)
docker exec rabbit rabbitmqctl purge_queue auth.payment.succeeded.q
```

### 3. Логирование в коде

```typescript
// Добавляйте подробные логи
console.log("[AUTH][RMQ] Publishing event:", { 
  type: event.type, 
  userId: event.payload.userId,
  messageId: event.messageId 
});

console.log("[AUTH][RMQ] Received message:", {
  queue: "auth.payment.succeeded.q",
  routingKey: msg.fields.routingKey,
  messageId: msg.properties.messageId
});
```

### 4. Мониторинг Outbox таблицы

```sql
-- Количество событий по статусам
SELECT status, COUNT(*) 
FROM outbox_events 
GROUP BY status;

-- События, которые долго не отправляются
SELECT * FROM outbox_events 
WHERE status = 'PENDING' 
AND created_at < NOW() - INTERVAL '5 minutes';

-- Проблемные события
SELECT * FROM outbox_events 
WHERE status = 'FAILED' 
AND attempts >= 3;
```

## Лучшие практики

### 1. Именование

- **Exchange**: `app.events`, `app.dlx`
- **Routing Keys**: `service.entity.action.version` → `auth.user.registered.v1`
- **Queues**: `service.event.q` → `auth.payment.succeeded.q`
- **Retry Queues**: `queue.retry.duration` → `auth.payment.succeeded.q.retry.1m`
- **DLQ**: `queue.dlq` → `auth.payment.succeeded.q.dlq`

### 2. Структура событий

```typescript
interface EventEnvelope<T> {
  messageId: string;      // Уникальный ID для идемпотентности
  traceId: string;        // Для трассировки через сервисы
  type: string;           // Тип события
  occurredAt: string;     // Когда произошло (ISO string)
  producer: string;       // Кто отправил
  payload: T;             // Данные события
}
```

### 3. Обработка ошибок

- **Временные ошибки** (сеть, БД недоступна) → retry
- **Постоянные ошибки** (неверный формат данных) → DLQ
- **Всегда логируйте** причину отправки в DLQ

### 4. Производительность

- Используйте **batch processing** в Outbox Publisher
- Настройте **prefetch** под вашу нагрузку
- **Мониторьте** размер очередей
- **Архивируйте** старые события из Outbox/Inbox

### 5. Безопасность

- Используйте **отдельных пользователей** для каждого сервиса
- Ограничивайте **права доступа** к конкретным exchange/queues
- **Шифруйте** чувствительные данные в payload

## Troubleshooting

### Сообщения не доставляются

1. **Проверьте подключение**:
   ```bash
   npm run rabbit:ping
   ```

2. **Проверьте binding в Web UI**:
   - Queues → выберите очередь → Bindings
   - Убедитесь, что routing key совпадает

3. **Проверьте логи**:
   ```bash
   docker logs rabbit
   ```

### Сообщения накапливаются в очереди

1. **Проверьте Consumer**:
   - Запущен ли сервис?
   - Нет ли ошибок в обработке?

2. **Увеличьте prefetch**:
   ```typescript
   await ch.prefetch(100); // Было 50
   ```

3. **Добавьте больше Consumer'ов**:
   ```bash
   # Запустите еще один экземпляр сервиса
   npm run start:auth
   ```

### Дублирование сообщений

1. **Проверьте идемпотентность**:
   - Используете ли Inbox паттерн?
   - Уникальные ли messageId?

2. **Проверьте ack/nack**:
   - Всегда ли вызываете `ch.ack(msg)`?
   - Не вызываете ли `ch.nack()` с `requeue: true`?

### RabbitMQ не запускается

1. **Проверьте порты**:
   ```bash
   netstat -tulpn | grep 5672
   ```

2. **Проверьте Docker**:
   ```bash
   docker ps
   docker logs rabbit
   ```

3. **Очистите данные** (ОСТОРОЖНО!):
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Медленная обработка

1. **Увеличьте параллелизм**:
   ```typescript
   await ch.prefetch(200);
   ```

2. **Оптимизируйте обработчики**:
   - Используйте batch операции с БД
   - Кешируйте частые запросы
   - Асинхронная обработка

3. **Мониторинг**:
   - Время обработки сообщений
   - Количество сообщений в секунду
   - Загрузка CPU/памяти

---

## Заключение

RabbitMQ — мощный инструмент для построения надежной асинхронной архитектуры. В нашем проекте он обеспечивает:

- ✅ **Надежную доставку** сообщений между микросервисами
- ✅ **Идемпотентную обработку** через Inbox паттерн  
- ✅ **Гарантированную публикацию** через Outbox паттерн
- ✅ **Retry логику** с Dead Letter Queues
- ✅ **Мониторинг и отладку** через Web UI

Следуя этому руководству, вы сможете эффективно работать с RabbitMQ в проекте и понимать, как происходит обмен сообщениями между сервисами.

**Полезные ссылки:**
- [Официальная документация RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [AMQP 0-9-1 Protocol](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [RabbitMQ Patterns](https://www.rabbitmq.com/getstarted.html)
```

Я создал подробное руководство по RabbitMQ на русском языке, которое покрывает все аспекты использования RabbitMQ в вашем проекте. Руководство включает:

1. **Базовые концепции** с простыми объяснениями
2. **Реальные примеры** из вашего кода
3. **Пошаговые инструкции** по настройке
4. **Паттерны Outbox и Inbox** с детальным объяснением
5. **Практические примеры** использования
6. **Troubleshooting** для решения проблем
7. **Лучшие практики** для production

Руководство написано специально для новичков в RabbitMQ и содержит все необходимые детали для понимания работы системы.
