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

// each module has it's own *.config.ts

@Injectable()
export class CoreEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable NODE_ENV, example: development",
	})
	env: string;

	@IsNotEmpty({
		message: "Set Env variable AUTH_POSTGRES_URL, example: postgresql://user:password@host:port/database",
	})
	databaseUrl: string;

	@IsNotEmpty({
		message: "Set Env variable PAYMENTS_TCP_HOST, example: 0.0.0.0",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable PAYMENTS_TCP_PORT, example: 3001",
	})
	tcpPort: number;

	@IsNotEmpty({
		message: "Set Env variable RMQ_URL, example: amqp://localhost:5672",
	})
	rmqUrl: string;

	constructor(private configService: ConfigService<any, true>) {
		this.env = this.configService.get<string>("NODE_ENV");
		this.databaseUrl = this.configService.get<string>("PAYMENTS_POSTGRES_URL");
		this.tcpHost = this.configService.get<string>("PAYMENTS_TCP_HOST");
		this.tcpPort = this.configService.get<number>("PAYMENTS_TCP_PORT");
		this.rmqUrl = this.configService.get<string>("RMQ_URL");

		configValidationUtility.validateConfig(this);
	}
}
