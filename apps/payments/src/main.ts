import { NestFactory } from "@nestjs/core";
import { initAppModule } from "./init-app";
import { CoreEnvConfig } from "./core/core-env.config";

async function bootstrap() {
	const dynamicAppModule = await initAppModule();

	const app = await NestFactory.create(dynamicAppModule);
	const config = app.get<CoreEnvConfig>(CoreEnvConfig);

	await app.listen(config.applicationPort);
}
bootstrap();
