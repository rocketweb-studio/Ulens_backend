import { configValidationUtility } from "@libs/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class FilesClientEnvConfig {
	@IsString()
	@IsNotEmpty({
		message: "Set Env variable FILES_TCP_HOST, example: localhost",
	})
	filesClientHost: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable FILES_TCP_PORT, example: 3001",
	})
	filesClientPort: number;

	@IsNotEmpty({
		message: "Set Env variable FILES_STREAMING_PORT, example: 3002",
	})
	filesClientStreamingPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.filesClientHost = this.configService.get<string>("FILES_TCP_HOST");
		this.filesClientPort = this.configService.get<number>("FILES_TCP_PORT");
		this.filesClientStreamingPort = this.configService.get<number>("FILES_STREAMING_PORT");

		configValidationUtility.validateConfig(this);
	}
}
