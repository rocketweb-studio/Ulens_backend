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

	constructor(private configService: ConfigService) {
		this.paypalClientId = this.configService.get<string>("PAYPAL_CLIENT_ID") as string;
		this.paypalSecretKey = this.configService.get<string>("PAYPAL_SECRET_KEY") as string;
		this.isSandbox = this.configService.get<boolean>("PAYPAL_IS_SANDBOX") as boolean;

		configValidationUtility.validateConfig(this);
	}
}
