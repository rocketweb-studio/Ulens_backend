import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

@Global()
@Module({})
export class RedisModule {
	static forRoot(): DynamicModule {
		return {
			module: RedisModule,
			imports: [ConfigModule],
			providers: [
				{
					provide: RedisService,
					useFactory: (configService: ConfigService) => {
						const redisUri = configService.getOrThrow<string>("REDIS_URI");
						return new RedisService(redisUri);
					},
					inject: [ConfigService],
				},
			],
			exports: [RedisService],
		};
	}
}
