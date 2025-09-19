import { NestFactory } from "@nestjs/core";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { initGatewayModule } from "@gateway/init-app";
import { configApp } from "@gateway/gateway.setup";

async function bootstrap() {
	const dynamicAppModule = await initGatewayModule();

	// { rawBody: true } - нужно для работы с raw body в вебхуках
	const app = await NestFactory.create(dynamicAppModule, { rawBody: true });
	const config = app.get<CoreEnvConfig>(CoreEnvConfig);

	configApp(app, config);
	await app.listen(config.applicationPort);
	console.log(`Gateway is running on port ${config.applicationPort}`);
}
bootstrap();
