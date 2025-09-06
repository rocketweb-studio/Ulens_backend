import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MainClientEnvConfig } from "@gateway/microservices/main/main-client.config";
import { Microservice } from "@libs/constants/microservices";
import { JwtModule } from "@nestjs/jwt";
import { FilesClientModule } from "@gateway/microservices/files/files-client.module";
import { PostsClientService } from "@gateway/microservices/main/posts/posts-client.service";
import { PostsClientController } from "@gateway/microservices/main/posts/posts-client.controller";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { FilesClientEnvConfig } from "@gateway/microservices/files/files-client.config";

@Module({
	imports: [
		ClientsModule.registerAsync([
			// MAIN microservice
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
			// AUTH microservice
			{
				name: Microservice.AUTH,
				useFactory: (config: AuthClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.authClientHost,
						port: config.authClientPort,
					},
				}),
				inject: [AuthClientEnvConfig],
				extraProviders: [AuthClientEnvConfig],
			},
			// FILES microservice
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
		JwtModule.registerAsync({
			useFactory: (mainEnvConfig: MainClientEnvConfig) => ({
				secret: mainEnvConfig.accessTokenSecret,
			}),
			inject: [MainClientEnvConfig],
			extraProviders: [MainClientEnvConfig],
		}),
		FilesClientModule,
	],
	controllers: [PostsClientController],
	providers: [MainClientEnvConfig, PostsClientService],
	exports: [],
})
export class MainClientModule {}
