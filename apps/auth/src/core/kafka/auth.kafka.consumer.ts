import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import type { Consumer, EachMessagePayload } from "kafkajs";
import { IUserCommandRepository } from "@auth/modules/user/user.interfaces";
import { AuthKafkaPublisher } from "./auth.kafka.publisher";

@Injectable()
export class AuthKafkaConsumer implements OnApplicationBootstrap {
	constructor(
		@Inject("KAFKA_CONSUMER") private readonly consumer: Consumer,
		private readonly userCommandRepository: IUserCommandRepository,
		private readonly kafkaPublisher: AuthKafkaPublisher,
	) {}

	/*
	Один groupId у нескольких реплик одного микросервиса-> партиции делятся между репликами, каждое 
		сообщение обрабатывает ровно один инстанс группы. 
	Разные groupId у разных сервисов → фан-аут: каждая группа прочитает все записи топика 
		(со своими независимыми оффсетами).
	У нас два валидных паттерна — выбираем по ситуации:
	A) Один общий топик app.events.v1
		-Все сервисы подписаны на него.
		-В коде каждого сервиса — лёгкий роутер по evt.type (или header rk): «нужные → обрабатываем, остальные → пропускаем».
		Плюсы: простота, одна точка для всех доменных событий.
		Минусы: сервис видит «лишние» записи, пусть и быстро их игнорирует.
	B) Доменные топики (рекомендовано, если не хотим получать «лишнее»)
		-Развести: auth.events.v1, payments.events.v1, …
		-auth_service подписан только на auth.events.v1 — вообще не видит платежные события.
		Плюсы: нет «мусорного» трафика, разные retention/ACL по доменам.
		Минусы: нужно создать и поддерживать несколько топиков.
	*/

	async onApplicationBootstrap() {
		console.log("[AUTH][KAFKA][BOOT]", {
			clientId: process.env.AUTH_KAFKA_CLIENT_ID,
			groupId: process.env.AUTH_KAFKA_GROUP_ID,
		});

		const topic = process.env.KAFKA_EVENTS_TOPIC ?? "app.events.v1";
		console.log("[AUTH][KAFKA][BOOT]", {
			clientId: process.env.AUTH_KAFKA_CLIENT_ID,
			groupId: process.env.AUTH_KAFKA_GROUP_ID,
		});
		await this.consumer.subscribe({ topic, fromBeginning: true });
		await this.consumer.run({
			partitionsConsumedConcurrently: 3,
			eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
				try {
					// Можно фильтровать по header 'rk' или по evt.type внутри payload
					const rk = message.headers?.rk?.toString();
					const keyStr = message.key?.toString();
					const offsetStr = message.offset;
					console.log("[AUTH][KAFKA][MSG_IN]", { topic, partition, offset: offsetStr, rk, key: keyStr });

					// === Старая тестовая логика по отправке сообщения при регистрации ===
					if (rk === "auth.user.registered.v1") {
						const body = message.value ? JSON.parse(message.value.toString()) : null;
						console.log(`[AUTH][KAFKA] ${topic}[p${partition}] -> auth.user.registered.v1 ${JSON.stringify(body)}`);
						return;
					}

					// === Обработка payment.succeeded (из payments) ===
					if (rk === "payment.succeeded") {
						const evt = message.value ? JSON.parse(message.value.toString()) : null;
						if (!evt) {
							console.log("[AUTH][KAFKA][PAYMENT_SUCCEEDED][SKIP_EMPTY_EVT]");
							return;
						}

						// evt может прийти как «плоский» (из payments outbox), так и в envelope
						const payload = evt.payload ?? evt;
						console.log("[AUTH][KAFKA][PAYMENT_SUCCEEDED][APPLY_ATTEMPT]", {
							messageId: evt.messageId ?? payload?.messageId,
							userId: payload?.userId,
							transactionId: payload?.transactionId,
						});

						const { premiumUntil } = await this.userCommandRepository.applyPaymentSucceeded({
							messageId: evt.messageId, // из envelope или плоского evt
							userId: payload.userId,
							planCode: payload.planCode,
							occurredAt: evt.occurredAt,
							transactionId: payload.transactionId,
							correlationId: evt.traceId ?? payload.correlationId,
						});
						console.log("[AUTH][KAFKA][PAYMENT_SUCCEEDED][APPLY_OK]", {
							userId: payload.userId,
							transactionId: payload.transactionId,
							premiumUntil: premiumUntil?.toISOString?.(),
						});

						// Отправляем подтверждение активации премиума
						await this.kafkaPublisher.publishUserPremiumActivatedKafkaEvent({
							transactionId: payload.transactionId,
							userId: payload.userId,
							planCode: payload.planCode,
							premiumUntil: premiumUntil.toISOString(),
							correlationId: evt.traceId ?? payload.correlationId,
						});
						console.log("[AUTH][KAFKA][PREMIUM_ACTIVATED][PUBLISH_OK]", {
							userId: payload.userId,
							transactionId: payload.transactionId,
						});

						console.log(`[AUTH][KAFKA] handled payment.succeeded tx=${payload.transactionId}`);
						return;
					}

					// другие сообщения нам не интересны — просто игнорируем
				} catch (error) {
					console.log(`eachMessage error: ${(error as Error).message}`, (error as Error).stack);
					// KafkaJS сам ретраит/передаст следующее сообщение согласно настройкам группы
				}
			},
		});

		console.log(`[AUTH][KAFKA] subscribed to ${topic}`);
	}
}
