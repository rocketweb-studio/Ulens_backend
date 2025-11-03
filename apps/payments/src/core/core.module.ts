import { forwardRef, Module } from "@nestjs/common";
import { configModule } from "@payments/core/env-config/env-config.module";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { StripeModule } from "@payments/core/stripe/stripe.module";
import { StripeConfig } from "@payments/core/stripe/stripe.config";
import Stripe from "stripe";
import { PrismaModule } from "@payments/core/prisma/prisma.module";
import { PayPalModule } from "./paypal/paypal.module";
import { RabbitModule } from "@libs/rabbit/index";
import { TransactionModule } from "@payments/modules/transaction/transaction.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [
		configModule,
		StripeModule.forRootAsync({
			useFactory: (stripeConfig: StripeConfig) => ({
				apiKey: stripeConfig.stripeApiKey,
				config: {
					apiVersion: stripeConfig.stripeApiVerwion,
				} as Stripe.StripeConfig,
			}),
			inject: [StripeConfig],
		}),
		PayPalModule,
		PrismaModule,
		RabbitModule,
		ScheduleModule.forRoot(),
		forwardRef(() => TransactionModule),
	],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}
