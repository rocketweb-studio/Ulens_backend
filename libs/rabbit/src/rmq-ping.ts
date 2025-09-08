// данная утилита используется только во время первичного подключения и последующей отладки брокера
import * as amqp from "amqplib";

(async () => {
	console.log("RMQ PING UTILITY");
	const url = process.env.RMQ_URL ?? "amqp://guest:guest@localhost:5672/";
	const conn = await amqp.connect(url); // type: amqp.Connection
	const ch = await conn.createConfirmChannel(); // or createChannel()

	await ch.assertExchange("app.events", "topic", { durable: true }); // quick call
	console.log("[OK] Connected to RabbitMQ:", url);

	await ch.close();
	await conn.close();
})().catch((e) => {
	console.error("[ERROR] RabbitMQ connection failed:", e.message);
	process.exit(1);
});
