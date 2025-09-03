import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class TestConsumer implements OnModuleInit {
	constructor(@Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel) {}

	// использовали для отлова тестового сообщения из gateway, это рабочий метод
	// async onModuleInit() {
	// 	// объявляем СВОЮ очередь этого сервиса
	// 	await this.ch.assertQueue("auth.test.queue", {
	// 		durable: true,
	// 		arguments: {
	// 			// если обработка упадёт → сообщение улетит в DLX
	// 			"x-dead-letter-exchange": "app.dlx",
	// 			"x-dead-letter-routing-key": "auth.test.queue.dlq",
	// 		},
	// 	});

	// 	//  биндим очередь к нашему topic-exchange на ключ test.event
	// 	await this.ch.bindQueue("auth.test.queue", "app.events", "test.event");

	// 	//  объявляем DLQ для наглядности (куда будут падать «плохие» сообщения)
	// 	await this.ch.assertQueue("auth.test.queue.dlq", { durable: true });
	// 	await this.ch.bindQueue("auth.test.queue.dlq", "app.dlx", "auth.test.queue.dlq");

	// 	//  запускаем консьюминг
	// 	await this.ch.consume(
	// 		"auth.test.queue",
	// 		async (msg) => {
	// 			if (!msg) return;
	// 			try {
	// 				const body = JSON.parse(msg.content.toString());
	// 				console.log("[AUTH][RMQ] got test.event:", body);

	// 				// обработка успешна → подтверждаем
	// 				this.ch.ack(msg);

	// 				// если хочешь протестировать падение и DLQ:
	// 				// throw new Error("fail to test DLQ");
	// 			} catch (error) {
	// 				console.error("[AUTH][RMQ] handler error:", error);
	// 				// nack без requeue → в DLQ
	// 				this.ch.nack(msg, false, false);
	// 			}
	// 		},
	// 		{ noAck: false },
	// 	);
	// }

	async onModuleInit() {
		await this.ch.assertQueue("auth.user.registered.q", {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "app.dlx",
				"x-dead-letter-routing-key": "auth.user.registered.q.dlq",
			},
		});

		await this.ch.bindQueue("auth.user.registered.q", "app.events", "auth.user.registered.v1");

		await this.ch.assertQueue("auth.user.registered.q.dlq", { durable: true });
		await this.ch.bindQueue("auth.user.registered.q.dlq", "app.dlx", "auth.user.registered.q.dlq");

		await this.ch.consume(
			"auth.user.registered.q",
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString());
					console.log("[AUTH][RMQ] got auth.user.registered.v1:", evt);
					this.ch.ack(msg);
				} catch (e) {
					console.error("[AUTH][RMQ] handler error:", e);
					this.ch.nack(msg, false, false);
				}
			},
			{ noAck: false },
		);
	}
}
