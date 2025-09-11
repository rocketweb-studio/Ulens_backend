import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { AuthTestManager } from "./auth-test-manager";
import { GatewayModule } from "../../src/gateway.module";
import { CoreEnvConfig } from "../../src/core/core.config";
import { configApp } from "../../src/gateway.setup";
import { startMicroserviceForTest } from "./startMicroserviceForTest";
import { RedisService } from "../../../../libs/redis/src/redis.service";
import { mockRedisService } from "./mocks/redis";
import { mockRabbitConnection, mockRabbitChannel } from "./mocks/rabbit";
import { PostsTestManager } from "./posts-test-manager";
import { ProfileTestManager } from "./profile-test-manager";

/**
 * initSettings служит для создания отдельного инстэнса нашего приложения и выполнения в нем тестов
 *    и использования переменных окружения среды из .env.testing.local
 */

export const initSettings = async (
	//передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
	addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
	// создаем тестовый модуль и можем конфигурировать его
	const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
		imports: [GatewayModule],
	})
		.overrideProvider(RedisService)
		.useValue(mockRedisService)
		.overrideProvider("RMQ_CONNECTION")
		.useValue(mockRabbitConnection)
		.overrideProvider("RMQ_CHANNEL")
		.useValue(mockRabbitChannel);

	if (addSettingsToModuleBuilder) {
		addSettingsToModuleBuilder(testingModuleBuilder);
	}

	const testingAppModule = await testingModuleBuilder.compile();

	const app = testingAppModule.createNestApplication();
	const coreConfig = app.get<CoreEnvConfig>(CoreEnvConfig);

	configApp(app, coreConfig);

	//  Запускаем микросервисы
	const authMicroservice = await startMicroserviceForTest("auth");
	const mainMicroservice = await startMicroserviceForTest("main");
	const filesMicroservice = await startMicroserviceForTest("files");

	await app.init();

	const httpServer = app.getHttpServer();
	const authTestManger = new AuthTestManager(app);
	const postsTestManger = new PostsTestManager(app);
	const profileTestManger = new ProfileTestManager(app);

	return {
		app,
		httpServer,
		authTestManger,
		postsTestManger,
		profileTestManger,
		authMicroservice,
		mainMicroservice,
		filesMicroservice,
	};
};
