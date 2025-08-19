import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { initAppModule } from "@auth/init-app";

async function bootstrap() {
	const { dynamicModule, config } = await initAppModule();

	const app = await NestFactory.createMicroservice(dynamicModule, {
		transport: Transport.TCP,
		options: {
			host: config.tcpHost,
			port: config.tcpPort,
		},
	});

	await app.listen();
	console.log(`Auth microservice is listening on port ${config.tcpPort}`);
}
bootstrap();
