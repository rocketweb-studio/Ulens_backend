import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

export enum Environments {
	DEVELOPMENT = "development",
	STAGING = "staging",
	PRODUCTION = "production",
	TESTING = "testing",
}

@Injectable()
export class CoreEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable NOTIFICATIONS_TCP_HOST, example: 0.0.0.0",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable NOTIFICATIONS_TCP_PORT, example: 3001",
	})
	tcpPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.tcpHost = this.configService.get<string>("NOTIFICATIONS_TCP_HOST");
		this.tcpPort = this.configService.get<number>("NOTIFICATIONS_TCP_PORT");

		configValidationUtility.validateConfig(this);
	}
}
