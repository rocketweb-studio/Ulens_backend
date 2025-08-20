import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class AuthClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable AUTH_CLIENT_HOST, example: localhost",
	})
	authClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable AUTH_CLIENT_PORT, example: 3001",
	})
	authClientPort: number;

	@IsNotEmpty({
		message: "Set Env variable ACCESS_SECRET_KEY, example: secret",
	})
	accessTokenSecret: string;

	@IsNotEmpty({
		message: "Set Env variable ACCESS_EXPIRES_IN, example: 1h",
	})
	accessTokenExpirationTime: string;

	constructor(private configService: ConfigService<any, true>) {
		this.authClientHost = this.configService.get<string>("AUTH_CLIENT_HOST");
		this.authClientPort = this.configService.get<number>("AUTH_CLIENT_PORT");
		this.accessTokenSecret = this.configService.get<string>("ACCESS_SECRET_KEY");
		this.accessTokenExpirationTime = this.configService.get<string>("ACCESS_EXPIRES_IN");

		configValidationUtility.validateConfig(this);
	}
}
