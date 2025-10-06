import * as amqp from "amqplib";
import { RabbitExchanges, RabbitRetryTtlMs, QueueConfig } from "@libs/rabbit/rabbit.constants";

export async function setupQueueWithRetryAndDLQ(ch: amqp.Channel, config: QueueConfig) {
	const { baseQueue, exchange, routingKey } = config;

	const retryQueue = `${baseQueue}.retry.1m`;
	const dlqQueue = `${baseQueue}.dlq`;
	const dlxExchange = RabbitExchanges.APP_DLX;

	// 1) Очередь для события
	await ch.assertQueue(baseQueue, {
		durable: true,
		arguments: {
			"x-dead-letter-exchange": dlxExchange,
			"x-dead-letter-routing-key": dlqQueue,
		},
	});

	await ch.bindQueue(baseQueue, exchange, routingKey);

	// 2) retry-очередь на 1 минуту
	await ch.assertQueue(retryQueue, {
		durable: true,
		arguments: {
			"x-message-ttl": RabbitRetryTtlMs,
			"x-dead-letter-exchange": exchange,
			"x-dead-letter-routing-key": routingKey,
		},
	});

	// 3) DLQ
	await ch.assertQueue(dlqQueue, { durable: true });
	await ch.bindQueue(dlqQueue, dlxExchange, dlqQueue);
}
