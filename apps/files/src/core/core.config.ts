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
		message: "Set Env variable NODE_ENV, example: development",
	})
	env: string;

	@IsNotEmpty({
		message: "Set Env variable FILES_TCP_HOST, example: localhost",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable FILES_TCP_PORT, example: 4003",
	})
	tcpPort: number;

	@IsNotEmpty({
		message: "Set Env variable FILES_POSTGRES_URL, example: postgresql://user:password@host:port/database",
	})
	databaseUrl: string;

	constructor(private configService: ConfigService<any, true>) {
		this.env = this.configService.get<string>("NODE_ENV");
		this.tcpHost = this.configService.get<string>("FILES_TCP_HOST");
		this.tcpPort = this.configService.get<number>("FILES_TCP_PORT");
		this.databaseUrl = this.configService.get<string>("FILES_POSTGRES_URL");

		configValidationUtility.validateConfig(this);
	}
}
