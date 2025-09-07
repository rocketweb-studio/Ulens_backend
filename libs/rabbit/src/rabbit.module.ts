import { Global, Module, OnModuleDestroy, Optional } from "@nestjs/common";
import * as amqp from "amqplib";

@Global() // модуль глобальный - доступен во всех сервисах без доп. импортов
@Module({
	providers: [
		{
			// Подключение к RabbitMQ (одно соединение на всё приложение)
			provide: "RMQ_CONNECTION",
			useFactory: async () => {
				// todo переменные не читаются
				const url = process.env.RMQ_URL || "amqp://guest:guest@localhost:5672/";
				const conn = await amqp.connect(url);
				conn.on("error", (e) => console.error("[RMQ] connection error:", e.message));
				conn.on("close", () => console.error("[RMQ] connection closed"));
				return conn;
			},
		},
		{
			// Канал RabbitMQ (используется для publish/consume)
			provide: "RMQ_CHANNEL",
			useFactory: async (conn: amqp.Connection) => {
				const ch = await (conn as any).createChannel(); // todo type fix

				// Создаём основной exchange для бизнес-событий.
				// Тип = "topic" → поддерживает гибкую маршрутизацию по ключам (например, "order.created", "payment.failed").
				// durable: true → exchange сохраняется при рестарте брокера.
				await ch.assertExchange("app.events", "topic", { durable: true });

				// Создаём отдельный exchange для "dead-letter" (DLX).
				// DLQ = безопасный буфер для сообщений, которые не смогли пройти обычную обработку.
				// Туда будут попадать сообщения, которые:
				//   - не удалось обработать (nack/reject без requeue),
				//   - или протухли (TTL истёк в retry-очереди).
				// durable: true → сохраняется при рестарте.
				await ch.assertExchange("app.dlx", "topic", { durable: true });

				// prefetch(50) = лимит сообщений на одного консьюмера.
				// RabbitMQ отдаст максимум 50 сообщений одновременно одному обработчику.
				// Это предотвращает "перегрузку" сервиса, даёт контроль параллелизма
				// и позволяет масштабировать через несколько конкурирующих консьюмеров (work queues).
				await ch.prefetch(50);

				return ch;
			},
			inject: ["RMQ_CONNECTION"],
		},
	],
	exports: ["RMQ_CONNECTION", "RMQ_CHANNEL"], // экспортируем, чтобы использовать в сервисах
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
