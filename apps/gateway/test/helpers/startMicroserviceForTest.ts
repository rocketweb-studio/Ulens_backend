import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule as AuthAppModule } from "@auth/app.module";
import { AppModule as MainAppModule } from "@main/app.module";

/**
 * Запускает микросервис для тестов, автоматически загружая .env.testing.local
 */

const microservicesRootModules = {
	auth: AuthAppModule,
	main: MainAppModule,
};

export const startMicroserviceForTest = async (microserviceName: string) => {
	const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(microservicesRootModules[microserviceName], {
		transport: Transport.TCP,
		// запуск микросервиса в тестовом окружении
		options: {
			host: process.env[`${microserviceName.toUpperCase()}_TCP_HOST`],
			port: +(process.env[`${microserviceName.toUpperCase()}_TCP_PORT`] ?? 0),
		},
	});

	await microservice.listen();
	return microservice;
};
