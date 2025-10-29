import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PaymentsClientController } from "@gateway/microservices/payments/payments-client.controller";
import { PaymentsClientService } from "@gateway/microservices/payments/payments-client.service";
import { PaymentsClientEnvConfig } from "@gateway/microservices/payments/payments-client.config";
import { Microservice } from "@libs/constants/microservices";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { JwtModule } from "@nestjs/jwt";
import { AuthClientModule } from "@gateway/microservices/auth/auth-client.module";
import { PaymentsGqlResolver } from "@gateway/microservices/payments/payments_gql/payments.resolver";

@Module({
	imports: [
		ClientsModule.registerAsync([
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
		AuthClientModule,
	],
	controllers: [PaymentsClientController],
	providers: [PaymentsClientEnvConfig, PaymentsClientService, PaymentsGqlResolver],
	exports: [],
})
export class PaymentsClientModule {}
