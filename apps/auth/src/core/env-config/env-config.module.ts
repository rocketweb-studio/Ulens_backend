import { ConfigModule } from "@nestjs/config";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Config file path:", `.env.${process.env.NODE_ENV}.local`);

export const configModule = ConfigModule.forRoot({
	envFilePath: [
		// local dev
		`.env.${process.env.NODE_ENV}.local`,
	],
	isGlobal: true,
});
