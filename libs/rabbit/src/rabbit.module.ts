import { Global, Module, OnModuleDestroy, Optional } from "@nestjs/common";
import * as amqp from "amqplib";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitExchanges, RMQ_CONNECTION } from "@libs/rabbit/rabbit.constants";
import { RMQ_CHANNEL } from "@libs/rabbit/rabbit.constants";

@Global() // модуль глобальный - доступен во всех сервисах без доп. импортов
@Module({
	imports: [ConfigModule],
	providers: [
		{
			// Подключение к RabbitMQ (одно соединение на всё приложение)
			provide: RMQ_CONNECTION,
			useFactory: async (configService: ConfigService) => {
				const url = configService.getOrThrow<string>("RMQ_URL");
				const conn = await amqp.connect(url);
				conn.on("error", (e) => console.error("[RMQ] connection error:", e.message));
				conn.on("close", () => console.error("[RMQ] connection closed"));
				return conn;
			},
			inject: [ConfigService],
		},
		{
			// Канал RabbitMQ (используется для publish/consume)
			provide: RMQ_CHANNEL,
			useFactory: async (conn: amqp.Connection) => {
				/* Этот тип канала заменили на createConfirmChannel потому, что он дает возможность подтверждать и гарантировать
					доставку сообщений. При этом методы, которые были написаны без требований подтверждения работают как обычно */
				// const ch = await (conn as any).createChannel();

				const ch = await (conn as any).createConfirmChannel();

				// Создаём основной exchange для бизнес-событий.
				// Тип = "topic" → поддерживает гибкую маршрутизацию по ключам (например, "order.created", "payment.failed").
				// durable: true → exchange сохраняется при рестарте брокера.
				await ch.assertExchange(RabbitExchanges.APP_EVENTS, "topic", { durable: true });

				// Создаём отдельный exchange для "dead-letter" (DLX).
				// DLQ = безопасный буфер для сообщений, которые не смогли пройти обычную обработку.
				// Туда будут попадать сообщения, которые:
				//   - не удалось обработать (nack/reject без requeue),
				//   - или протухли (TTL истёк в retry-очереди).
				// durable: true → сохраняется при рестарте.
				await ch.assertExchange(RabbitExchanges.APP_DLX, "topic", { durable: true });

				// prefetch(50) = лимит сообщений на одного консьюмера.
				// RabbitMQ отдаст максимум 50 сообщений одновременно одному обработчику.
				// Это предотвращает "перегрузку" сервиса, даёт контроль параллелизма
				// и позволяет масштабировать через несколько конкурирующих консьюмеров (work queues).
				await ch.prefetch(50);

				return ch;
			},
			inject: [RMQ_CONNECTION],
		},
	],
	exports: [RMQ_CONNECTION, RMQ_CHANNEL], // экспортируем, чтобы использовать в сервисах
})
export class RabbitModule implements OnModuleDestroy {
	constructor(
		@Optional() private readonly rmqConn?: amqp.Connection,
		@Optional() private readonly rmqCh?: amqp.Channel,
	) {}

	// При завершении работы приложения → корректно закрываем соединение и канал
	async onModuleDestroy() {
		try {
			await this.rmqCh?.close();
		} catch {}
		try {
			await (this.rmqConn as any)?.close();
		} catch {} // todo type fix
	}
}
