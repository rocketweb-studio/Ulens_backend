import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { ThrottlerModule } from "@nestjs/throttler";
import { FilesClientEnvConfig } from "@gateway/microservices/files/files-client.config";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: Microservice.FILES,
				useFactory: (config: FilesClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.filesClientHost,
						port: config.filesClientPort,
					},
				}),
				inject: [FilesClientEnvConfig],
				extraProviders: [FilesClientEnvConfig],
			},
		]),
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
	],
	controllers: [],
	providers: [FilesClientService, FilesClientEnvConfig],
	exports: [FilesClientService],
})
export class FilesClientModule {}
