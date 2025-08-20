import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MainClientEnvConfig } from "@gateway/microservices/main/main-client.config";
import { MainClientController } from "@gateway/microservices/main/main-client.controller";
import { MainClientService } from "@gateway/microservices/main/main-client.service";
import { Microservice } from "@libs/constants/microservices";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: Microservice.MAIN,
				useFactory: (config: MainClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.mainClientHost,
						port: config.mainClientPort,
					},
				}),
				inject: [MainClientEnvConfig],
				extraProviders: [MainClientEnvConfig],
			},
		]),
	],
	controllers: [MainClientController],
	providers: [MainClientService, MainClientEnvConfig],
	exports: [MainClientService],
})
export class MainClientModule {}
