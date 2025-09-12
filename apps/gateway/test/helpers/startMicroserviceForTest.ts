import { Test, TestingModule } from "@nestjs/testing";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule as AuthAppModule } from "@auth/app.module";
import { AppModule as MainAppModule } from "@main/app.module";
import { AppModule as FilesAppModule } from "@files/app.module";
import { mockRabbitConnection, mockRabbitChannel } from "./mocks/rabbit";

const microservicesRootModules = {
	auth: AuthAppModule,
	main: MainAppModule,
	files: FilesAppModule,
};

export const startMicroserviceForTest = async (microserviceName: string) => {
	const rootModule = microservicesRootModules[microserviceName];

	// ✅ Build TestingModule so we can override providers
	const testingModule: TestingModule = await Test.createTestingModule({
		imports: [rootModule],
	})
		.overrideProvider("RMQ_CONNECTION")
		.useValue(mockRabbitConnection)
		.overrideProvider("RMQ_CHANNEL")
		.useValue(mockRabbitChannel)
		.compile();

	// ✅ Create microservice from the compiled testing module
	const microservice = testingModule.createNestMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			host: process.env[`${microserviceName.toUpperCase()}_TCP_HOST`],
			port: +(process.env[`${microserviceName.toUpperCase()}_TCP_PORT`] ?? 0),
		},
	});

	await microservice.listen();
	return microservice;
};
