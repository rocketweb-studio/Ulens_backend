import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { AuthClientController } from "@gateway/microservices/auth/contollers/auth-client.controller";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import { Microservice } from "@libs/constants/microservices";
import { NotificationsClientModule } from "@gateway/microservices/notifications/notifications-client.module";
import { JwtModule } from "@nestjs/jwt";
import { MainClientModule } from "@gateway/microservices/main/main-client.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { GoogleStrategy } from "@gateway/core/guards/google/google.strategy";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { GithubStrategy } from "@gateway/core/guards/github/github.strategy";
import { AuthClientOAuthController } from "./contollers/oauth.auth-client.controller";

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
		MainClientModule,
	],
	controllers: [AuthClientController, AuthClientOAuthController],
	providers: [AuthClientService, AuthClientEnvConfig, GoogleStrategy, GithubStrategy, CoreEnvConfig],
})
export class AuthClientModule {}
