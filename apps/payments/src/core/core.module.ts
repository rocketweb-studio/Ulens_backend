import { Module } from "@nestjs/common";
import { configModule } from "@payments/core/env-config/env-config.module";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { StripeModule } from "@payments/core/stripe/stripe.module";
import { StripeConfig } from "@payments/core/stripe/stripe.config";
import Stripe from "stripe";
import { PrismaModule } from "@payments/core/prisma/prisma.module";
import { PayPalModule } from "./paypal/paypal.module";
import { PayPalConfig } from "./paypal/paypal.config";

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
		PayPalModule.forRootAsync({
			useFactory: async (config: PayPalConfig) => ({
				clientId: config.paypalClientId,
				clientSecret: config.paypalSecretKey,
				isSandbox: config.isSandbox,
				logLevel: "Info",
			}),
			inject: [PayPalConfig],
		}),
		PrismaModule,
	],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}
