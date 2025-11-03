import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MainClientEnvConfig } from "@gateway/microservices/main/main-client.config";
import { Microservice } from "@libs/constants/microservices";
import { JwtModule } from "@nestjs/jwt";
import { FilesClientModule } from "@gateway/microservices/files/files-client.module";
import { PostsClientService } from "@gateway/microservices/main/posts/posts-client.service";
import { PostsClientController } from "@gateway/microservices/main/posts/posts-client.controller";
import { AuthClientModule } from "@gateway/microservices/auth/auth-client.module";
import { PostsClientResolver } from "@gateway/microservices/main/posts_gql/posts-client.resolver";
import { PubSubGqlModule } from "@gateway/pubSubGql/pubSub-gql.module";

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
		AuthClientModule,
		PubSubGqlModule,
	],
	controllers: [PostsClientController],
	providers: [MainClientEnvConfig, PostsClientService, PostsClientResolver],
	exports: [PostsClientService],
})
export class MainClientModule {}
