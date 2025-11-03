import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class PubSubGqlConfig {
	@IsNotEmpty()
	redisUri: string;

	constructor(private configService: ConfigService<any, true>) {
		this.redisUri = this.configService.get<string>("REDIS_URI");

		configValidationUtility.validateConfig(this);
	}
}
