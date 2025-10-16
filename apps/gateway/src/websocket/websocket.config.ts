import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class WebsocketEnvConfig {
	@IsNotEmpty({
		message: "Set Env variable ACCESS_SECRET_KEY, example: secret",
	})
	accessTokenSecret: string;

	constructor(private configService: ConfigService<any, true>) {
		this.accessTokenSecret = this.configService.get<string>("ACCESS_SECRET_KEY");

		configValidationUtility.validateConfig(this);
	}
}
