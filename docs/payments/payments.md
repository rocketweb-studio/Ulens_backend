# Payments Микросервис - Детальное описание работы

## Компоненты системы

### 1. Gateway

В Gateway есть ряд эндпоинтов для клиента а так же отдельные эндпоинты для вебхуков, которыми будут пользоваться только платежные системы для оповещения нашего бэкэнда. 

#### --------------STRIPE--------------
В main.ts при инициализации приложения нужно указать параметр { rawBody: true }:
`const app = await NestFactory.create(dynamicAppModule, { rawBody: true });`
Данная настройка нужна для корректной работы вебхука от Stripe. 

Stripe подписывает свои webhook-запросы с помощью HMAC SHA256, и чтобы проверить их подлинность, нужно использовать точно такое тело запроса, какое Stripe отправил — без парсинга(с помощью body-parcer), без изменений.
{ rawBody: true } не отключает обычный body-parser, а просто добавляет req.rawBody — то есть сохраняет оригинальное тело запроса в виде Buffer, в дополнение к уже распарсенному req.body.
Обычные контроллеры, использующие @Body(), будут работать как раньше.

Так же Stripe присылает подпись в заголовке, которую нужно извлечь через `@Headers("stripe-signature")` и отправить дальше в микросервис для обработки.

#### --------------PAYPAL--------------
Для работы Paypal нет каких-либо требований. Данные от платежной системы приходят просто в req.body.


### 2. Payments Microservice (apps/payments/)

#### Основные модули:

**Stripe Module(core/stripe)** - адаптер для работы с Stripe API с помощью npm-пакета stripe.

**PayPal Module(core/paypal)** - адаптер для работы с PayPal API.

**Plan Module** - управление тарифными планами:
- Создание планов в платежных системах и локальной БД
- Удаление планов из платежных систем и БД
- Получение списка планов из БД

**Transaction Module** - обработка платежей:
- Создание платежных сессий в Stripe или PayPal в зависимости от выбранной системы
- Управление статусами платежных транзакций
- Получение истории платежных транзакций

**Subscription Module** - управление подписками:
- Создание подписок после успешной оплаты
- Управление автопродлением
- Получение информации о подписках

**Webhook Module** - обработка событий от платежных систем:
- Валидация webhook подписей(если это Stripe)
- Обработка событий оплаты
- Обновление статусов транзакций и подписок

## Планы

Для того чтобы проводить оплаты по подписочной модели, необходимо в платежных системах создавать следующие сущности:

#### --------------STRIPE--------------
- создать customer
- создать product
- создать plan

После чего создаем платежную сессию, и после оплаты в stripe создается subscription


#### --------------PAYPAL--------------
- создать product
- создать plan
- создать subscription

#### ----------------------------

После создания планов в платежных системах создаем в своей базе запись о плане с необходимыми айди из платежных систем.

Управление планами происходит через эндпоинты `/payments/plans`

Мы можем создавать тарифные планы. Так как у нас система подписки, то платежные системы предоставляет только 4 вида подписки - день, неделя, месяц, год. Создание происходит через POST запрос на `/payments/plans` в соответствии с API.

Удалить план из платежных систем и бд можно используя DELETE запрос на `/payments/plans` в соответствии с API.

## Детальный поток обработки платежа

### Шаг 1: Инициация платежа

1. **Клиент** отправляет POST-запрос на `/payments/make-payment` с данными:
   ```json
   {
     "planId": "id-плана",
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
   - Создает платежную сессию через обращение к необходимому адаптеру - `paypalServie` или `stripeService`
	 - Сохраняет транзакцию в БД со статусом `PENDING`
	 - Содержит крон для изменения статуса транзакций на expired, если ссылка истекла и оплата не прошла.
   - Возвращает URL для оплаты в контроллер

5.1. **createSubscriptionCheckoutSession()** (метод stripe-адаптера):
   - Создает клиента в Stripe: `stripeService.customers.create()`
   - Создает сессию оплаты: `stripeService.checkout.sessions.create()`
   - Настраивает параметры оплаты(тип оплаты, стоимость, план и тд.)
   - Возвращает URL для оплаты

5.2. **createPayPalSubscription()** (метод paypal-адаптера):
   - Получает accessToken от paypal для дальнейших запросов
   - Конфигурирует обьект с опциями подписки(тип оплаты, стоимость, план и тд.)
   - Отправляет запрос с этим обьектом на `/v1/billing/subscriptions`
   - Возвращает URL для оплаты


### Шаг 3.1: Обработка webhook от Stripe

1. **Stripe** отправляет webhook на `/payments/webhook/stripe` при изменении статуса сессии

2. **Gateway** (PaymentsClientController):
   - Получает raw body и stripe-signature заголовок
   - Передает данные в payments микросервис

3. **WebhookController** получает сообщение и вызывает `WebhookService.receiveWebhookStripe()`

4. **WebhookService - Stripe**:
    - Валидирует подпись через `stripeService.webhooks.constructEvent()`
    - Обрабатывает различные типы событий с правильной типизацией
    - Обновляет записи в БД в соответствии с бизнес логикой

#### Событие `checkout.session.completed`:
- Получает объект типа `Stripe.Checkout.Session`
- Извлекает `userId` и `planId` из metadata
- Получает план из БД
- Вычисляет дату окончания подписки на основе интервала плана
- Создает подписку через `SubscriptionService.createSubscription()`
- Обновляет статус транзакции на `SUCCESS`

#### Событие `checkout.session.expired`:
- Получает объект типа `Stripe.Checkout.Session`
- Обновляет статус транзакции на `EXPIRED`

#### Событие `checkout.session.async_payment_failed`:
- Получает объект типа `Stripe.Checkout.Session`
- Обновляет статус транзакции на `FAILED`

#### Событие `invoice.payment_succeeded` (автооплата подписки):
- Получает объект типа `Stripe.Invoice`
- Проверяет `billing_reason === "subscription_cycle"` - для того чтобы различать это первый платеж или автосписание. Необходимо так как это событие срабатывает во всех случаях.
- Извлекает данные из `session.parent.subscription_details.metadata`
- Получает план и текущую подписку из БД
- Создает новую транзакцию через `TransactionService.createTransaction()`
- Обновляет статус транзакции на `SUCCESS`
- Продлевает подписку через `SubscriptionService.updateSubscription()`

#### Событие `invoice.payment_failed` (автооплата подписки):
- Получает объект типа `Stripe.Invoice`
- Проверяет `billing_reason === "subscription_cycle"` - для того чтобы различать это первый платеж или автосписание. Необходимо так как это событие срабатывает во всех случаях.
- Извлекает данные из `session.parent.subscription_details.metadata`
- Получает план и текущую подписку из БД
- Отменяет подписку в Stripe через `stripeService.subscriptions.cancel()`
- Создает новую транзакцию через `TransactionService.createTransaction()`
- Обновляет статус транзакции на `FAILED`
- Удаляет подписку из БД через `SubscriptionService.deleteSubscription()`

Все типы событий можно посмотреть в документации - https://docs.stripe.com/api/events/types


### Шаг 3.2: Обработка webhook от PayPal

1. **PayPal** отправляет webhook на `/payments/webhook/paypal` при изменении статуса сессии

2. **Gateway** (PaymentsClientController):
   - Получает req.body
   - Передает данные в payments микросервис

3. **WebhookController** получает сообщение и вызывает `WebhookService.receiveWebhookPayPal()`

4. **WebhookService - PayPal**:
    - Обрабатывает различные типы событий с правильной типизацией
    - Обновляет записи в БД в соответствии с бизнес логикой

#### Событие `BILLING.SUBSCRIPTION.ACTIVATED`:
- Получает объект с данными из вебхука.
- Извлекает `userId` и `planId` из custom_id
- Получает план из БД
- Вычисляет дату окончания подписки на основе интервала плана
- Создает подписку через `subscriptionService.createSubscription()` или обновляет `isAutoRenewal` поле если это было автопродление существующей подписки.

#### Событие `PAYMENT.SALE.COMPLETED` (оплата подписки):
- Получает объект с данными из вебхука.
- Извлекает `planId`, `transactId`, `userId` из custom
- Получает план и транзакцию по `transactId` из БД
- Если эта транзакция в PENDING значит это первая транзакция в подписке и обновляет ее статус на `SUCCESS`.
- Если эта транзакция не в PENDING и имеет тот же `paypalSessionId` значит вебхук пришел повторно для уже совершенной операции
- Если эта транзакция не в PENDING и имеет другой `paypalSessionId` значит это новая транзакция при автопродлении. Создает новую транзакцию через `transactionService.createTransaction()` со статусом `SUCCESS` 
- Продлевает подписку через `SubscriptionService.updateSubscription()`

#### Событие `PAYMENT.SALE.DENIED` (неудачная оплата подписки):
- Получает объект с данными из вебхука.
- Извлекает `planId`, `transactId`, `userId` из custom
- Получает план и транзакцию по `transactId` из БД
- Если эта транзакция в PENDING значит это первая транзакция в подписке и обновляет ее статус на `FAILED`.
- Если эта транзакция не в PENDING и имеет тот же `paypalSessionId` значит вебхук пришел повторно для уже совершенной операции
- Если эта транзакция не в PENDING и имеет другой `paypalSessionId` значит это новая транзакция при автопродлении. Создает новую транзакцию через `transactionService.createTransaction()` со статусом `FAILED` 

#### Событие `BILLING.SUBSCRIPTION.SUSPENDED`:
- Извлекает `userId` из custom_id
- Обновляет в подписке `{ isAutoRenewal: false }`

#### Событие `BILLING.SUBSCRIPTION.EXPIRED`:
- Извлекает `userId` из custom_id
- Удаляет подписку(soft delete)

Все типы событий можно посмотреть в документации - https://developer.paypal.com/api/rest/webhooks/event-names/

### Шаг 4: Завершение процесса

12. **Клиент** перенаправляется на success_url или cancel_url
13. **Подписка** активируется в системе(создается соответствующая запись в таблице subscriptions, уведомляется пользователь и меняется его статус премиум-подписки)
14. **Транзакция** получает финальный статус

### Типы событий Stripe которые сейчас используются

- `checkout.session.completed` - успешная оплата при создании подписки
- `checkout.session.expired` - истекшая сессия оплаты
- `checkout.session.async_payment_failed` - неудачная оплата при создании подписки
- `invoice.payment_succeeded` - успешная автооплата подписки (продление)
- `invoice.payment_failed` - неудачная автооплата подписки (продление)

### Типы событий PayPal которые сейчас используются

- `BILLING.SUBSCRIPTION.ACTIVATED` - успешная активация подписки
- `PAYMENT.SALE.COMPLETED` - успешная оплата при создании подписки или продлении
- `PAYMENT.SALE.DENIED` - неудачная оплата
- `BILLING.SUBSCRIPTION.SUSPENDED` - остановка подписки - для того чтобы она не продлевалась
- `BILLING.SUBSCRIPTION.EXPIRED` - окончание срока действия подписки

### Статусы платежных транзакций

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
PayPal - https://developer.paypal.com/api/rest