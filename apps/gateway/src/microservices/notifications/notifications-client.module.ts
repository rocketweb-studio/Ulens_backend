import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { NotificationsClientEnvConfig } from "@gateway/microservices/notifications/notifications-client.config";
import { NotificationsClientService } from "@gateway/microservices/notifications/notifications-client.service";
import { NotificationsClientController } from "@gateway/microservices/notifications/notifications-client.controller";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: Microservice.NOTIFICATIONS,
				useFactory: (config: NotificationsClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.notificationsClientHost,
						port: config.notificationsClientPort,
					},
				}),
				inject: [NotificationsClientEnvConfig],
				extraProviders: [NotificationsClientEnvConfig],
			},
		]),
		JwtModule.registerAsync({
			useFactory: (authEnvConfig: AuthClientEnvConfig) => ({
				secret: authEnvConfig.accessTokenSecret,
			}),
			inject: [AuthClientEnvConfig],
			extraProviders: [AuthClientEnvConfig],
		}),
	],
	controllers: [NotificationsClientController],
	providers: [NotificationsClientService, NotificationsClientEnvConfig],
	exports: [NotificationsClientService],
})
export class NotificationsClientModule {}
