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
		message: "Set Env variable GATEWAY_PORT, example: 3000",
	})
	applicationPort: number;

	@IsNotEmpty()
	allowedOrigins: string;

	@IsNotEmpty()
	googleClientId: string;

	@IsNotEmpty()
	googleClientSecret: string;

	@IsNotEmpty()
	googleCallbackUrl: string;

	@IsNotEmpty()
	frontendUrl: string;

	@IsNotEmpty()
	githubClientId: string;

	@IsNotEmpty()
	githubClientSecret: string;

	@IsNotEmpty()
	githubCallbackUrl: string;

	@IsNotEmpty()
	recaptchaSecretKey: string;

	@IsNotEmpty()
	accessTokenSecret: string;

	@IsNotEmpty()
	accessTokenExpirationTime: string;

	@IsNotEmpty()
	rmqUrl: string;

	@IsNotEmpty()
	adminEmail: string;

	@IsNotEmpty()
	adminPassword: string;

	@IsNotEmpty()
	adminAccessTokenSecret: string;

	@IsNotEmpty()
	adminAccessTokenExpirationTime: string;

	constructor(private configService: ConfigService<any, true>) {
		this.env = this.configService.get<string>("NODE_ENV");
		this.applicationPort = this.configService.get<number>("GATEWAY_PORT");
		this.allowedOrigins = this.configService.get<string>("ALLOWED_ORIGINS");
		this.googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
		this.googleClientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
		this.googleCallbackUrl = this.configService.get<string>("GOOGLE_CALLBACK_URL");
		this.githubClientId = this.configService.get<string>("GITHUB_CLIENT_ID");
		this.githubClientSecret = this.configService.get<string>("GITHUB_CLIENT_SECRET");
		this.githubCallbackUrl = this.configService.get<string>("GITHUB_CALLBACK_URL");
		this.frontendUrl = this.configService.get<string>("FRONTEND_URL");
		this.recaptchaSecretKey = this.configService.get<string>("RECAPTCHA_SECRET_KEY");

		this.accessTokenSecret = this.configService.get<string>("ACCESS_SECRET_KEY");
		this.accessTokenExpirationTime = this.configService.get<string>("ACCESS_EXPIRES_IN");

		this.adminAccessTokenSecret = this.configService.get<string>("ADMIN_ACCESS_SECRET_KEY");
		this.adminAccessTokenExpirationTime = this.configService.get<string>("ADMIN_ACCESS_EXPIRES_IN");

		this.rmqUrl = this.configService.get<string>("RMQ_URL");

		this.adminEmail = this.configService.get<string>("ADMIN_EMAIL");
		this.adminPassword = this.configService.get<string>("ADMIN_PASSWORD");

		configValidationUtility.validateConfig(this);
	}
}
