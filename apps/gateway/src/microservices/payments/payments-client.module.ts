import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { AuthClientModule } from "@gateway/microservices/auth/auth-client.module";
import { NotificationsClientModule } from "@gateway/microservices/notifications/notifications-client.module";
import { SubscriptionsClientService } from "@gateway/microservices/payments/subscriptions/subscriptions-client.service";
import { SubscriptionsClientController } from "@gateway/microservices/payments/subscriptions/subscriptions-client.controller";
import { PaymentsClientEnvConfig } from "@gateway/microservices/payments/payments-client.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		ClientsModule.registerAsync([
			// PAYMENTS microservice
			{
				name: Microservice.PAYMENTS,
				useFactory: (config: PaymentsClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.paymentsClientHost,
						port: config.paymentsClientPort,
					},
				}),
				inject: [PaymentsClientEnvConfig],
				extraProviders: [PaymentsClientEnvConfig],
			},
		]),
		JwtModule.registerAsync({
			useFactory: (paymentsEnvConfig: PaymentsClientEnvConfig) => ({
				secret: paymentsEnvConfig.accessTokenSecret,
			}),
			inject: [PaymentsClientEnvConfig],
			extraProviders: [PaymentsClientEnvConfig],
		}),
		AuthClientModule,
		NotificationsClientModule,
	],
	controllers: [SubscriptionsClientController],
	providers: [SubscriptionsClientService],
	exports: [],
})
export class PaymentsClientModule {}
