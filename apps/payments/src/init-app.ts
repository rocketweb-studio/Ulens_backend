import { NestFactory } from "@nestjs/core";
import { PaymentsModule } from "@/payments.module";
import { CoreEnvConfig } from "@/core/core-env.config";
import { DynamicModule } from "@nestjs/common";

export const initAppModule = async (): Promise<DynamicModule> => {
	const appContext = await NestFactory.createApplicationContext(PaymentsModule);
	const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
	await appContext.close();

	return PaymentsModule.forRoot(config);
};
