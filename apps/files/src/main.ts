import { NestFactory } from "@nestjs/core";
import { initAppModule } from "@files/init-app";

async function bootstrap() {
	const { dynamicModule, config } = await initAppModule();

	// const app = await NestFactory.createMicroservice(dynamicModule, {
	// 	transport: Transport.TCP,
	// 	options: {
	// 		host: config.tcpHost,
	// 		port: config.tcpPort,
	// 	},
	// });
	//! not microservice
	const app = await NestFactory.create(dynamicModule);

	await app.listen(config.tcpPort);
	console.log(`Files microservice is listening on port ${config.tcpPort}`);
}
bootstrap();
