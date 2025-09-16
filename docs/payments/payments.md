# Payments Микросервис - Детальное описание работы

## Компоненты системы

### 1. Gateway

В Gateway есть ряд эндпоинтов для клиента а так же отдельный эндпоинт для вебхука, которым будет пользоваться только Stripe для оповещения нашего бэкэнда. 

В main.ts при инициализации приложения нужно указать параметр { rawBody: true }:
`const app = await NestFactory.create(dynamicAppModule, { rawBody: true });`

Stripe подписывает свои webhook-запросы с помощью HMAC SHA256, и чтобы проверить их подлинность, нужно использовать точно такое тело запроса, какое Stripe отправил — без парсинга(с помощью body-parcer), без изменений.
{ rawBody: true } не отключает обычный body-parser, а просто добавляет req.rawBody — то есть сохраняет оригинальное тело запроса в виде Buffer, в дополнение к уже распарсенному req.body.
Обычные контроллеры, использующие @Body(), будут работать как раньше.

Так же Stripe присылает подпись в заголовке, которую нужно извлечь через `@Headers("stripe-signature")` и отправить дальше в микросервис для обработки.

### 2. Payments Microservice (apps/payments/)

#### Основные модули:

**Stripe Module(core/stripe)** - адаптер для работы с Stripe API с помощью npm-пакета stripe.

**Plan Module** - управление тарифными планами:
- Создание планов в Stripe и локальной БД
- Удаление планов из Stripe и БД
- Получение списка планов

**Transaction Module** - обработка платежей:
- Создание платежных сессий в Stripe
- Управление статусами транзакций
- Получение истории транзакций

**Subscription Module** - управление подписками:
- Создание подписок после успешной оплаты
- Управление автопродлением
- Получение информации о подписках

**Webhook Module** - обработка событий от Stripe:
- Валидация webhook подписей
- Обработка событий оплаты
- Обновление статусов транзакций и подписок

## Планы

Для того чтобы производить оплаты нужно создать планы(товары) в системе Stripe.
Управление планами происходит через эндпоинты `/payments/plans`

Мы можем создавать тарифные планы. Так как у нас система подписки по ТЗ, то Stripe предоставляет только 4 вида подписки - день, неделя, месяц, год. Создание происходит через POST запрос на `/payments/plans` в соответствии с API.

Удалить план из Stripe и бд можно используя DELETE запрос на `/payments/plans` в соответствии с API.

## Детальный поток обработки платежа

### Шаг 1: Инициация платежа

1. **Клиент** отправляет POST-запрос на `/payments/make-payment` с данными:
   ```json
   {
     "planId": "uuid-плана",
     "provider": "STRIPE"
   }
   ```

2. **Gateway**:
   - Проверяет JWT-токен через `JwtAccessAuthGuard`
   - Извлекает данные пользователя через `ExtractUserFromRequest`
   - Передает необходимые данные в `PaymentsClientService`
	 - `PaymentsClientService` получает данные пользователя через `AuthClientService.me()`
   - Отправляет TCP-сообщение `MAKE_PAYMENT` в payments микросервис с необходимыми данными

### Шаг 2: Обработка в Payments микросервисе

4. **TransactionController** 
   - Получает сообщение
   - Проверяет существование плана через `PlanQueryRepository`
   - Вызывает `TransactionService.makePayment()`

5. **TransactionService.makePayment()**:
   - Проверяет отсутствие активной подписки у пользователя
   - Создает Stripe Checkout Session через `makeStripePayment()`
	 - Проверяет какой нужен провайдер для оплаты и вызывает соответствующий приватный метод

6. **makeStripePayment()** (приватный метод):
   - Создает клиента в Stripe: `stripeService.customers.create()`
   - Создает сессию оплаты: `stripeService.checkout.sessions.create()`
   - Настраивает параметры оплаты(тип оплаты, стоимость, продукт и тд.)
   - Возвращает URL для оплаты

7. **Создание транзакции**:
   - Сохраняет транзакцию в БД со статусом `PENDING`
   - Возвращает URL для оплаты клиенту

### Шаг 3: Обработка webhook от Stripe

8. **Stripe** отправляет webhook на `/payments/webhook/stripe` при изменении статуса сессии

9. **Gateway** (PaymentsClientController):
   - Получает raw body и stripe-signature заголовок
   - Передает данные в payments микросервис

10. **WebhookController** получает сообщение и вызывает `WebhookService.receiveWebhookStripe()`

11. **WebhookService - Stripe**:
    - Валидирует подпись через `stripeService.webhooks.constructEvent()`
    - Обрабатывает различные типы событий с правильной типизацией
    - Обновляет записи в БД в соответствии с бизнес логикой

#### Событие `checkout.session.completed`:
- Приводит объект к типу `Stripe.Checkout.Session`
- Извлекает `userId` и `planId` из metadata
- Получает план из БД
- Вычисляет дату окончания подписки на основе интервала плана
- Создает подписку через `SubscriptionService.createSubscription()`
- Обновляет статус транзакции на `SUCCESS`

#### Событие `checkout.session.expired`:
- Приводит объект к типу `Stripe.Checkout.Session`
- Обновляет статус транзакции на `EXPIRED`

#### Событие `checkout.session.async_payment_failed`:
- Приводит объект к типу `Stripe.Checkout.Session`
- Обновляет статус транзакции на `FAILED`

#### Событие `invoice.payment_succeeded` (автооплата подписки):
- Приводит объект к типу `Stripe.Invoice`
- Проверяет `billing_reason === "subscription_cycle"`
- Извлекает данные из `session.parent.subscription_details.metadata`
- Получает план и текущую подписку из БД
- Создает новую транзакцию через `TransactionService.createTransaction()`
- Обновляет статус транзакции на `SUCCESS`
- Продлевает подписку через `SubscriptionService.updateSubscription()`

#### Событие `invoice.payment_failed` (автооплата подписки):
- Приводит объект к типу `Stripe.Invoice`
- Проверяет `billing_reason === "subscription_cycle"`
- Извлекает данные из `session.parent.subscription_details.metadata`
- Получает план и текущую подписку из БД
- Отменяет подписку в Stripe через `stripeService.subscriptions.cancel()`
- Создает новую транзакцию через `TransactionService.createTransaction()`
- Обновляет статус транзакции на `FAILED`
- Удаляет подписку из БД через `SubscriptionService.deleteSubscription()`

Все типы событий можно посмотреть в документации - https://docs.stripe.com/api/events/types

### Шаг 4: Завершение процесса

12. **Клиент** перенаправляется на success_url или cancel_url
13. **Подписка** активируется в системе(создается соответствующая запись в таблице subscriptions, уведомляется пользователь и меняется его статус премиум-подписки)
14. **Транзакция** получает финальный статус

## Интеграция со Stripe

### Конфигурация Stripe

```typescript
// StripeConfig
stripeApiKey: string        // STRIPE_SECRET_KEY
stripeWebhookSecret: string // STRIPE_WEBHOOK_SECRET  
stripeApiVersion: string    // STRIPE_API_VERSION
```

### Типы событий Stripe которые сейчас используются

- `checkout.session.completed` - успешная оплата при создании подписки
- `checkout.session.expired` - истекшая сессия оплаты
- `checkout.session.async_payment_failed` - неудачная оплата при создании подписки
- `invoice.payment_succeeded` - успешная автооплата подписки (продление)
- `invoice.payment_failed` - неудачная автооплата подписки (продление)

### Статусы транзакций

- `PENDING` - ожидает оплаты
- `SUCCESS` - успешно оплачена
- `FAILED` - неудачная оплата
- `EXPIRED` - истекшая сессия


## Расширяемость

Архитектура позволяет легко добавить:
- Новые платежные провайдеры (PayPal, и др.)
- Дополнительные типы подписок
- Новые события webhook
- Дополнительную бизнес-логику

### Документация

Stripe - https://docs.stripe.com/