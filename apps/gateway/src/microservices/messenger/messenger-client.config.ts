import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class MessengerClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable MESSENGER_TCP_HOST, example: localhost",
	})
	messengerClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable MESSENGER_TCP_PORT, example: 3001",
	})
	messengerClientPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.messengerClientHost = this.configService.get<string>("MESSENGER_TCP_HOST");
		this.messengerClientPort = this.configService.get<number>("MESSENGER_TCP_PORT");

		configValidationUtility.validateConfig(this);
	}
}
