import { NestFactory } from "@nestjs/core";
import { CoreEnvConfig } from "@/core/core-env.config";
import { DynamicModule } from "@nestjs/common";
import { FilesModule } from "./files.module";

export const initAppModule = async (): Promise<DynamicModule> => {
	const appContext = await NestFactory.createApplicationContext(FilesModule);
	const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
	await appContext.close();

	return FilesModule.forRoot(config);
};
