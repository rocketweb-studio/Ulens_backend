import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import type { Consumer, EachMessagePayload } from "kafkajs";
import { ISubscriptionCommandRepository } from "@payments/modules/subscriptions/subscription.interface";

@Injectable()
export class PaymentsKafkaConsumer implements OnApplicationBootstrap {
	constructor(
		@Inject("KAFKA_CONSUMER") private readonly consumer: Consumer,
		private readonly repo: ISubscriptionCommandRepository,
	) {
		console.log("[PAYMENTS][KafkaConsumer] constructed");
	}

	async onApplicationBootstrap() {
		console.log("[KAFKA] payments clientId=", process.env.PAYMENTS_KAFKA_CLIENT_ID);
		console.log("[KAFKA] payments groupId =", process.env.PAYMENTS_KAFKA_GROUP_ID);

		const topic = process.env.KAFKA_EVENTS_TOPIC ?? "app.events.v1";
		console.log("[PAYMENTS][KAFKA][SUBSCRIBE_ATTEMPT]", { topic, fromBeginning: true });

		await this.consumer.subscribe({ topic, fromBeginning: true });
		console.log("[PAYMENTS][KAFKA][SUBSCRIBED]", { topic });

		await this.consumer.run({
			partitionsConsumedConcurrently: 3,
			eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
				const rk = message.headers?.rk?.toString();
				const keyStr = message.key?.toString();
				const offsetStr = message.offset;
				console.log("[PAYMENTS][KAFKA][MSG_IN]", { topic, partition, offset: offsetStr, rk, key: keyStr });

				try {
					if (rk !== "auth.user.premium.activated.v1") return;

					const evt = message.value ? JSON.parse(message.value.toString()) : null;
					if (!evt) {
						console.log("[PAYMENTS][KAFKA][PREMIUM_ACTIVATED][SKIP_EMPTY_EVT]");
						return;
					}

					const payload = evt.payload ?? evt;
					console.log("[PAYMENTS][KAFKA][PREMIUM_ACTIVATED][FINALIZE_ATTEMPT]", {
						messageId: evt.messageId ?? payload?.messageId,
						transactionId: payload?.transactionId,
						userId: payload?.userId,
					});

					await this.repo.finalizeAfterPremiumActivated({
						messageId: evt.messageId,
						transactionId: payload.transactionId,
						userId: payload.userId,
						planCode: payload.planCode,
						premiumUntil: payload.premiumUntil, // ISO строка (если захочешь использовать)
						occurredAt: evt.occurredAt,
						correlationId: evt.traceId ?? payload.correlationId,
					});

					console.log(`[PAYMENTS][KAFKA][PREMIUM_ACTIVATED][FINALIZE_OK] tx=${payload.transactionId}`);
				} catch (e) {
					console.log(`eachMessage error: ${(e as Error).message}`, (e as Error).stack);
				}
			},
		});

		console.log(`[PAYMENTS][KAFKA] subscribed to ${topic}`);
	}
}
