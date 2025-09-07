import { Module } from "@nestjs/common";
import { RabbitController } from "./rabbit.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.NODE_ENV}.local`],
			isGlobal: true,
		}),
	],
	controllers: [RabbitController],
	providers: [],
})
export class RabbitModule {}
