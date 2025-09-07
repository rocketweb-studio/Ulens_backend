import { Module } from "@nestjs/common";
import { RedisController } from "./redis.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.NODE_ENV}.local`],
			isGlobal: true,
		}),
	],
	controllers: [RedisController],
	providers: [],
})
export class RedisModule {}
