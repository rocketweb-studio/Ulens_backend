import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MainClientEnvConfig } from "@gateway/microservices/main/main-client.config";
import { Microservice } from "@libs/constants/microservices";
import { JwtModule } from "@nestjs/jwt";
import { FilesClientModule } from "../files/files-client.module";
import { PostsClientService } from "./posts/posts-client.service";
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
		JwtModule.registerAsync({
			useFactory: (mainEnvConfig: MainClientEnvConfig) => ({
				secret: mainEnvConfig.accessTokenSecret,
			}),
			inject: [MainClientEnvConfig],
			extraProviders: [MainClientEnvConfig],
		}),
		FilesClientModule,
	],
	controllers: [],
	providers: [MainClientEnvConfig, PostsClientService],
	exports: [],
})
export class MainClientModule {}
