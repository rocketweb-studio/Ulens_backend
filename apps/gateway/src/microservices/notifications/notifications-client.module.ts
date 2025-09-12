import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { NotificationsClientEnvConfig } from "@gateway/microservices/notifications/notifications-client.config";
import { NotificationsClientService } from "@gateway/microservices/notifications/notifications-client.service";

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
	],
	controllers: [],
	providers: [NotificationsClientService, NotificationsClientEnvConfig],
	exports: [NotificationsClientService],
})
export class NotificationsClientModule {}
