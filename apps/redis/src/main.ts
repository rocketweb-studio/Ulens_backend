import { NestFactory } from "@nestjs/core";
import { configApp } from "./redis.setup";
import { RedisModule } from "./redis.module";

async function bootstrap() {
	const app = await NestFactory.create(RedisModule);

	configApp(app);
	await app.listen(process.env.REDIS_PORT as string);
	console.log(`Redis is running on port ${process.env.REDIS_PORT}`);
}
bootstrap();
