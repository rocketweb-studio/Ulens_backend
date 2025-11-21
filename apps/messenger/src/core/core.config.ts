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
		message: "Set Env variable MESSENGER_TCP_HOST, example: 0.0.0.0",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable MESSENGER_TCP_PORT, example: 3001",
	})
	tcpPort: number;

	@IsNotEmpty({
		message: "Set Env variable MESSENGER_POSTGRES_URL, example: postgresql://user:password@host:port/database",
	})
	databaseUrl: string;

	@IsNotEmpty({
		message: "Set Env variable RMQ_URL, example: amqp://localhost:5672",
	})
	rabbitUri: string;

	constructor(private configService: ConfigService<any, true>) {
		this.tcpHost = this.configService.get<string>("MESSENGER_TCP_HOST");
		this.tcpPort = this.configService.get<number>("MESSENGER_TCP_PORT");
		this.databaseUrl = this.configService.get<string>("MESSENGER_POSTGRES_URL");
		this.rabbitUri = this.configService.get<string>("RMQ_URL");

		configValidationUtility.validateConfig(this);
	}
}
