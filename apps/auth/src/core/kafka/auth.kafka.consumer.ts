import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import type { Consumer, EachMessagePayload } from "kafkajs";

@Injectable()
export class AuthKafkaConsumer implements OnApplicationBootstrap {
	constructor(@Inject("KAFKA_CONSUMER") private readonly consumer: Consumer) {}

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
		await this.consumer.subscribe({ topic: "app.events.v1", fromBeginning: false });
		await this.consumer.run({
			partitionsConsumedConcurrently: 3,
			eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
				// Можно фильтровать по header 'rk' или по evt.type внутри payload:
				const rk = message.headers?.rk?.toString();
				if (rk !== "auth.user.registered.v1") return;

				const body = message.value ? JSON.parse(message.value.toString()) : null;
				// TODO: здесь позже добавим Inbox/идемпотентность по messageId
				console.log(`[AUTH][KAFKA] ${topic}[p${partition}] ->`, body);
			},
		});

		console.log("[AUTH][KAFKA] subscribed to app.events.v1");
	}
}
