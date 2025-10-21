import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { AuthClientController } from "@gateway/microservices/auth/contollers/auth-client.controller";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import { Microservice } from "@libs/constants/microservices";
import { NotificationsClientModule } from "@gateway/microservices/notifications/notifications-client.module";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { GoogleStrategy } from "@gateway/core/guards/google/google.strategy";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { GithubStrategy } from "@gateway/core/guards/github/github.strategy";
import { AuthClientOAuthController } from "@gateway/microservices/auth/contollers/oauth.auth-client.controller";
import { ProfileAuthClientController } from "./profile/profile-auth-client.controller";
import { ProfileAuthClientService } from "./profile/profile-auth-clien.service";
import { FilesClientModule } from "../files/files-client.module";
import { MainClientEnvConfig } from "../main/main-client.config";
import { SessionAuthClientController } from "./session/session-auth-client.controller";
import { SessionAuthClientService } from "./session/session-auth-clien.service";
import { UsersGqlResolver } from "./users_gql/users.resolver";
import { UsersGqlClientService } from "./users_gql/users.service";
@Module({
	imports: [
		ClientsModule.registerAsync([
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
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
		JwtModule.registerAsync({
			useFactory: (authEnvConfig: AuthClientEnvConfig) => ({
				secret: authEnvConfig.accessTokenSecret,
			}),
			inject: [AuthClientEnvConfig],
			extraProviders: [AuthClientEnvConfig],
		}),
		NotificationsClientModule,
		FilesClientModule,
	],
	controllers: [AuthClientController, AuthClientOAuthController, ProfileAuthClientController, SessionAuthClientController],
	providers: [
		AuthClientService,
		AuthClientEnvConfig,
		GoogleStrategy,
		GithubStrategy,
		CoreEnvConfig,
		ProfileAuthClientService,
		SessionAuthClientService,
		UsersGqlResolver,
		UsersGqlClientService,
	],
	exports: [ProfileAuthClientService, AuthClientService],
})
export class AuthClientModule {}
