import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum Environments {
	DEVELOPMENT = "development",
	STAGING = "staging",
	PRODUCTION = "production",
	TESTING = "testing",
}

@Injectable()
export class CoreEnvConfig {
	@IsEnum(Environments, {
		message: `Ser correct NODE_ENV value, available values: ${configValidationUtility.getEnumValues(Environments).join(", ")}`,
	})
	env: string;

	@IsNotEmpty({
		message: "Set Env variable PORT, example: 3000",
	})
	applicationPort: number;

	@IsNotEmpty()
	allowedOrigins: string;

	constructor(private configService: ConfigService<any, true>) {
		this.env = this.configService.get<string>("NODE_ENV");
		this.applicationPort = this.configService.get<number>("PORT");
		this.allowedOrigins = this.configService.get<string>("ALLOWED_ORIGINS");

		configValidationUtility.validateConfig(this);
	}
}
