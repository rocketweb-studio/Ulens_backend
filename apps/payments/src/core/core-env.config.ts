import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

export enum Environments {
	DEVELOPMENT = "development",
	STAGING = "staging",
	PRODUCTION = "production",
	TESTING = "testing",
}

// each module has it's own *.config.ts

@Injectable()
export class CoreEnvConfig {
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

	@IsNotEmpty({
		message: "Set Env variable FRONTEND_PAYMENTS_REDIRECT_URL, example: http://localhost:3000",
	})
	redirectUrl: string;

	constructor(private configService: ConfigService<any, true>) {
		this.tcpHost = this.configService.get<string>("PAYMENTS_TCP_HOST");
		this.tcpPort = this.configService.get<number>("PAYMENTS_TCP_PORT");
		this.rmqUrl = this.configService.get<string>("RMQ_URL");
		this.redirectUrl = this.configService.get<string>("FRONTEND_PAYMENTS_REDIRECT_URL");

		configValidationUtility.validateConfig(this);
	}
}
