import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";
import { configValidationUtility } from "@libs/utils/env-validation.utility";

@Injectable()
export class StripeConfig {
	@IsNotEmpty({
		message: "Set Env variable STRIPE_API_KEY",
	})
	stripeApiKey: string;

	@IsNotEmpty({
		message: "Set Env variable STRIPE_WEBHOOK_SECRET",
	})
	stripeWebhookSecret: string;

	@IsNotEmpty({
		message: "Set Env variable STRIPE_API_VERSION",
	})
	stripeApiVerwion: string;

	constructor(private configService: ConfigService) {
		this.stripeApiKey = this.configService.get<string>("STRIPE_SECRET_KEY") as string;
		this.stripeWebhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET") as string;
		this.stripeApiVerwion = this.configService.get<string>("STRIPE_API_VERSION") as string;

		configValidationUtility.validateConfig(this);
	}
}
