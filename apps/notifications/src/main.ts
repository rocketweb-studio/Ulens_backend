import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { initAppModule } from "@notifications/init-app";

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
	console.log(`Notifications microservice is listening on port ${config.tcpPort}`);
}
bootstrap();
