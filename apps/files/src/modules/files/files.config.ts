import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class FilesConfig {
	@IsNotEmpty({
		message: "Set Env variable FILES_STREAMING_PORT, example: 3002",
	})
	streamingPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.streamingPort = this.configService.get<number>("FILES_STREAMING_PORT");

		configValidationUtility.validateConfig(this);
	}
}
