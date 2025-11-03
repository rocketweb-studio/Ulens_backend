import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";
import { configValidationUtility } from "@libs/utils/env-validation.utility";

@Injectable()
export class PayPalConfig {
	@IsNotEmpty({
		message: "Set Env variable PAYPAL_CLIENT_ID",
	})
	paypalClientId: string;

	@IsNotEmpty({
		message: "Set Env variable PAYPAL_SECRET_KEY",
	})
	paypalSecretKey: string;

	@IsNotEmpty({
		message: "Set Env variable PAYPAL_IS_SANDBOX",
	})
	isSandbox: boolean;

	@IsNotEmpty({
		message: "Set Env variable FRONTEND_PAYMENTS_REDIRECT_URL, example: http://localhost:3000",
	})
	redirectUrl: string;

	constructor(private configService: ConfigService) {
		this.paypalClientId = this.configService.get<string>("PAYPAL_CLIENT_ID") as string;
		this.paypalSecretKey = this.configService.get<string>("PAYPAL_SECRET_KEY") as string;
		this.isSandbox = this.configService.get<boolean>("PAYPAL_IS_SANDBOX") as boolean;
		this.redirectUrl = this.configService.get<string>("FRONTEND_PAYMENTS_REDIRECT_URL") as string;

		configValidationUtility.validateConfig(this);
	}
}
