import { NestFactory } from "@nestjs/core";
import { RabbitModule } from "./rabbit.module";

async function bootstrap() {
	const app = await NestFactory.create(RabbitModule);

	await app.listen(process.env.RMQ_PORT as string);
	console.log(`Rabbit is running on port ${process.env.RMQ_PORT}`);
}
bootstrap();
