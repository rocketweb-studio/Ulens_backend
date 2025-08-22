import { ConfigModule } from "@nestjs/config";

export const configModule = ConfigModule.forRoot({
	envFilePath: [
		// local dev
		`.env.${process.env.NODE_ENV}.local`,
	],
	isGlobal: true,
});
