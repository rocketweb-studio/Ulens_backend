import { NestFactory } from "@nestjs/core";
import { DynamicModule } from "@nestjs/common";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { GatewayModule } from "@gateway/gateway.module";

export const initGatewayModule = async (): Promise<DynamicModule> => {
	const appContext = await NestFactory.createApplicationContext(GatewayModule);
	const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
	await appContext.close();

	return GatewayModule.forRoot(config);
};
