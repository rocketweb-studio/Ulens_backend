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
	@IsNotEmpty({
		message: "Set Env variable AUTH_POSTGRES_URL, example: postgresql://user:password@host:port/database",
	})
	databaseUrl: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable AUTH_TCP_HOST, example: 0.0.0.0",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable AUTH_TCP_PORT, example: 3001",
	})
	tcpPort: number;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable NODE_ENV, example: development",
	})
	env: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable REDIS_URI, example: redis://localhost:6379",
	})
	redisUri: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable RMQ_URL, example: amqp://localhost:5672",
	})
	rabbitUri: string;

	constructor(private configService: ConfigService<any, true>) {
		this.env = this.configService.get<string>("NODE_ENV");
		this.databaseUrl = this.configService.get<string>("AUTH_POSTGRES_URL");
		this.tcpHost = this.configService.get<string>("AUTH_TCP_HOST");
		this.tcpPort = this.configService.get<number>("AUTH_TCP_PORT");
		this.redisUri = this.configService.get<string>("REDIS_URI");
		this.rabbitUri = this.configService.get<string>("RMQ_URL");

		configValidationUtility.validateConfig(this);
	}
}
