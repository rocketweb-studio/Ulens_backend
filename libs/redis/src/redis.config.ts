import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfig {
	redisUri: string;

	constructor(private configService: ConfigService) {
		this.redisUri = this.configService.getOrThrow<string>("REDIS_URI");
	}
}
