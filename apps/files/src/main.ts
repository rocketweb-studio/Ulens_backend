import { NestFactory } from "@nestjs/core";
import { initAppModule } from "@files/init-app";
import { Transport } from "@nestjs/microservices";

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
	console.log(`Files microservice is listening on port ${config.tcpPort}`);
}
bootstrap();
