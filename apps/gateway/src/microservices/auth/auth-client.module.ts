import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { AuthClientController } from "@gateway/microservices/auth/api/auth-client.controller";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import { Microservice } from "@libs/constants/microservices";
import { NotificationsClientModule } from "@gateway/microservices/notifications/notifications-client.module";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { GoogleStrategy } from "@gateway/core/guards/google/google.strategy";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { GithubStrategy } from "@gateway/core/guards/github/github.strategy";
import { AuthClientOAuthController } from "@gateway/microservices/auth/api/oauth.auth-client.controller";
import { ProfileAuthClientController } from "@gateway/microservices/auth/profile/profile-auth-client.controller";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientModule } from "@gateway/microservices/files/files-client.module";
import { MainClientEnvConfig } from "@gateway/microservices/main/main-client.config";
import { SessionAuthClientController } from "@gateway/microservices/auth/session/session-auth-client.controller";
import { SessionAuthClientService } from "@gateway/microservices/auth/session/session-auth-clien.service";
import { UsersGqlResolver } from "@gateway/microservices/auth/users_gql/users.resolver";
import { UsersGqlClientService } from "@gateway/microservices/auth/users_gql/users_gql.service";
import { UsersClientController } from "./users/users-client.controller";
import { UsersClientService } from "./users/users-client.service";
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
	controllers: [AuthClientController, AuthClientOAuthController, ProfileAuthClientController, SessionAuthClientController, UsersClientController],
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
		UsersClientService,
	],
	exports: [ProfileAuthClientService, AuthClientService, UsersClientService],
})
export class AuthClientModule {}
