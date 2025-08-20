import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule as AuthAppModule } from "@auth/app.module";
import * as dotenv from "dotenv";
import * as path from "path";

/**
 * Запускает микросервис для тестов, автоматически загружая .env.testing.local
 * из соответствующей папки apps/{microserviceName}
 */

const microservicesRootModules = {
	auth: AuthAppModule,
};

export const startMicroserviceForTest = async (microserviceName: string) => {
	const envPath = path.resolve(__dirname, `../../../${microserviceName}/.env.testing.local`);
	dotenv.config({ path: envPath });
	console.log(`[env] Loaded for ${microserviceName}: ${envPath}`);

	const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(microservicesRootModules[microserviceName], {
		transport: Transport.TCP,
		// запуск микросервиса в тестовом окружении
		options: {
			host: process.env.TCP_HOST,
			port: +(process.env.TCP_PORT ?? 0),
		},
	});

	await microservice.listen();
	return microservice;
};
