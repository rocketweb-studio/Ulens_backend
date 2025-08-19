import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class NotificationsClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable NOTIFICATIONS_CLIENT_HOST, example: localhost",
	})
	notificationsClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable NOTIFICATIONS_CLIENT_PORT, example: 3001",
	})
	notificationsClientPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.notificationsClientHost = this.configService.get<string>(
			"NOTIFICATIONS_CLIENT_HOST",
		);
		this.notificationsClientPort = this.configService.get<number>(
			"NOTIFICATIONS_CLIENT_PORT",
		);

		configValidationUtility.validateConfig(this);
	}
}
