import { configModule } from "./env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { RedisModule } from "@libs/redis/redis.module";

@Module({
	imports: [configModule, RedisModule.forRoot()],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}
