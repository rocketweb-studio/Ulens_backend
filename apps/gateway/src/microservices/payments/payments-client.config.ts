import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class PaymentsClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable PAYMENTS_TCP_HOST, example: localhost",
	})
	paymentsClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable PAYMENTS_TCP_PORT, example: 3002",
	})
	paymentsClientPort: number;

	@IsNotEmpty({
		message: "Set Env variable ACCESS_SECRET_KEY, example: secret",
	})
	accessTokenSecret: string;

	@IsNotEmpty({
		message: "Set Env variable ACCESS_EXPIRES_IN, example: 1h",
	})
	accessTokenExpirationTime: string;

	constructor(private configService: ConfigService<any, true>) {
		this.paymentsClientHost = this.configService.get<string>("PAYMENTS_TCP_HOST");
		this.paymentsClientPort = this.configService.get<number>("PAYMENTS_TCP_PORT");
		this.accessTokenSecret = this.configService.get<string>("ACCESS_SECRET_KEY");
		this.accessTokenExpirationTime = this.configService.get<string>("ACCESS_EXPIRES_IN");

		configValidationUtility.validateConfig(this);
	}
}
