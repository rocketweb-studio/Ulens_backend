import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class MainClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable MAIN_TCP_HOST, example: localhost",
	})
	mainClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable MAIN_TCP_PORT, example: 3002",
	})
	mainClientPort: number;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable ACCESS_SECRET_KEY, example: secret",
	})
	accessTokenSecret: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable ACCESS_EXPIRES_IN, example: 1h",
	})
	accessTokenExpirationTime: string;

	constructor(private configService: ConfigService<any, true>) {
		this.mainClientHost = this.configService.get<string>("MAIN_TCP_HOST");
		this.mainClientPort = this.configService.get<number>("MAIN_TCP_PORT");

		this.accessTokenSecret = this.configService.get<string>("ACCESS_SECRET_KEY");
		this.accessTokenExpirationTime = this.configService.get<string>("ACCESS_EXPIRES_IN");

		configValidationUtility.validateConfig(this);
	}
}
