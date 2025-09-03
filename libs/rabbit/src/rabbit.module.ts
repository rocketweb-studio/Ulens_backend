import { Global, Module, OnModuleDestroy, Optional } from "@nestjs/common";
import * as amqp from "amqplib";

@Global()
@Module({
	providers: [
		{
			provide: "RMQ_CONNECTION",
			useFactory: async () => {
				const url = process.env.RMQ_URL || "amqp://guest:guest@localhost:5672/";
				const conn = await amqp.connect(url);
				conn.on("error", (e) => console.error("[RMQ] connection error:", e.message));
				conn.on("close", () => console.error("[RMQ] connection closed"));
				return conn;
			},
		},
		{
			provide: "RMQ_CHANNEL",
			useFactory: async (conn: amqp.Connection) => {
				const ch = await (conn as any).createChannel(); // todo type fix
				await ch.assertExchange("app.events", "topic", { durable: true });
				await ch.assertExchange("app.dlx", "topic", { durable: true });
				await ch.prefetch(50);
				return ch;
			},
			inject: ["RMQ_CONNECTION"],
		},
	],
	exports: ["RMQ_CONNECTION", "RMQ_CHANNEL"],
})
export class RabbitModule implements OnModuleDestroy {
	constructor(
		@Optional() private readonly rmqConn?: amqp.Connection,
		@Optional() private readonly rmqCh?: amqp.Channel,
	) {}

	async onModuleDestroy() {
		try {
			await this.rmqCh?.close();
		} catch {}
		try {
			await (this.rmqConn as any)?.close();
		} catch {} // todo type fix
	}
}
