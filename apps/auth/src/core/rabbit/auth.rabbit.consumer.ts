import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { IUserCommandRepository } from "@auth/modules/user/user.interfaces";
import { RabbitEventsPublisher } from "./auth.rabbit.publisher";

@Injectable()
export class RabbitAuthConsumer implements OnModuleInit {
	constructor(
		@Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel,
		private readonly userCommandRepository: IUserCommandRepository,
		private readonly eventsPublisher: RabbitEventsPublisher,
	) {}

	async onModuleInit() {
		// === подписка на событие от payments ===
		// 1) Очереди для события из payments
		await this.ch.assertQueue("auth.payment.succeeded.q", {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "app.dlx",
				"x-dead-letter-routing-key": "auth.payment.succeeded.q.dlq",
			},
		});
		await this.ch.bindQueue("auth.payment.succeeded.q", "app.events", "payment.succeeded");

		// retry-очередь на 1 минуту
		await this.ch.assertQueue("auth.payment.succeeded.q.retry.1m", {
			durable: true,
			arguments: {
				"x-message-ttl": 60_000,
				"x-dead-letter-exchange": "app.events",
				"x-dead-letter-routing-key": "payment.succeeded",
			},
		});

		// DLQ
		await this.ch.assertQueue("auth.payment.succeeded.q.dlq", { durable: true });
		await this.ch.bindQueue("auth.payment.succeeded.q.dlq", "app.dlx", "auth.payment.succeeded.q.dlq");

		// 2) Консьюм сообщения payment.succeeded
		await this.ch.consume(
			"auth.payment.succeeded.q",
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						messageId: string;
						userId: string;
						planCode: string; // "PREMIUM_MONTH" и т.п.
						occurredAt: string;
						transactionId: string;
						correlationId: string;
					};

					/**
					 * Когда мы читаем сообщение из очереди, Rabbit ждет от нас решения: ack (успешно) или nack (ошибка).
					 * Если мы просто делаем ack, то при повторной доставке того же события (например, из-за ретрая или из-за повторной публикации)
					 * 		мы можем обработать его дважды. (например, дважды начислим бонус).
					 * 		Раньше я такого не использовал но для работы с платежами и распределенными транзакциями это имеет смысл
					 * Идемпотентность = гарантия, что каждое событие будет обработано ровно один раз, даже если оно придёт повторно.
					 * Как это делается:
					 * В evt.messageId (мы его формируем в publisher через randomUUID()) содержится уникальный ID события.
					 * В auth или другом сервисе мы заводим таблицу в БД, например processed_messages(message_id TEXT PRIMARY KEY, processed_at TIMESTAMP).
					 * Перед тем, как реально обрабатывать событие:
					 * Проверяем в БД: обрабатывали ли мы уже это messageId.
					 * Если да → просто делаем ack и игнорируем.
					 * Если нет → обрабатываем, сохраняем запись с этим messageId, и только потом делаем ack.
					 */

					// даже если одно сообщение по какой-то причине пришло к нам несколько раз в applyPaymentSucceeded
					// мы поймем это по messageId и ниже просто ack(msg) без каких либо последствий
					const { premiumUntil } = await this.userCommandRepository.applyPaymentSucceeded({
						messageId: evt.messageId,
						userId: evt.userId,
						planCode: evt.planCode,
						occurredAt: evt.occurredAt,
						transactionId: evt.transactionId,
						correlationId: evt.correlationId,
					});

					// публикуем подтверждение в "payments-svc" о том, что на стороне auth-svc обновление статуса пользователя
					// прошло успешно и транзакцию можно закрывать
					await this.eventsPublisher.publishUserPremiumActivated({
						transactionId: evt.transactionId,
						userId: evt.userId,
						planCode: evt.planCode,
						premiumUntil: premiumUntil.toISOString(),
						correlationId: evt.correlationId,
					});
					console.log("[AUTH][RMQ] got payment.succeeded:", evt);

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue("auth.payment.succeeded.q.retry.1m", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish("app.dlx", "auth.payment.succeeded.q.dlq", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
					}
				}
			},
			{ noAck: false },
		);

		// -------------Register testing queue. Консьюмим msg отправленный этим же микросервисом ----------------
		// основная очередь
		await this.ch.assertQueue("auth.user.registered.q", {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "app.dlx",
				"x-dead-letter-routing-key": "auth.user.registered.q.dlq",
			},
		});
		await this.ch.bindQueue("auth.user.registered.q", "app.events", "auth.user.registered.v1");

		// retry-очередь на 1 минуту (TTL), возвращает обратно в app.events с тем же ключом
		await this.ch.assertQueue("auth.user.registered.q.retry.1m", {
			durable: true,
			arguments: {
				"x-message-ttl": 60_000,
				"x-dead-letter-exchange": "app.events",
				"x-dead-letter-routing-key": "auth.user.registered.v1",
			},
		});

		// DLQ (мертвая очередь)
		await this.ch.assertQueue("auth.user.registered.q.dlq", { durable: true });
		await this.ch.bindQueue("auth.user.registered.q.dlq", "app.dlx", "auth.user.registered.q.dlq");

		// консьюмим сообщение
		await this.ch.consume(
			"auth.user.registered.q",
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString());
					// здесь будем логика обработки полученого msg и идемпотентность по evt.messageId (перед ack)

					console.log("[AUTH][RMQ] got auth.user.registered.v1:", evt);
					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						// отправляем в retry-очередь на 1 минуту, увеличив счётчик
						this.ch.sendToQueue("auth.user.registered.q.retry.1m", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg); // текущее сообщение подтверждаем
					} else {
						// после 3 попыток — в DLQ
						this.ch.publish("app.dlx", "auth.user.registered.q.dlq", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
					}
				}
			},
			{ noAck: false },
		);
	}
	// -------------End of Register testing queue----------------
}
