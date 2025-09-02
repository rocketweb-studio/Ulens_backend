import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { AuthTestManager } from "./auth-test-manager";
import { GatewayModule } from "../../src/gateway.module";
import { CoreEnvConfig } from "../../src/core/core.config";
import { configApp } from "../../src/gateway.setup";
import { startMicroserviceForTest } from "./startMicroserviceForTest";

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
	});

	if (addSettingsToModuleBuilder) {
		addSettingsToModuleBuilder(testingModuleBuilder);
	}

	const testingAppModule = await testingModuleBuilder.compile();

	const app = testingAppModule.createNestApplication();
	const coreConfig = app.get<CoreEnvConfig>(CoreEnvConfig);

	configApp(app, coreConfig);

	//  Запускаем микросервис auth
	const authMicroservice = await startMicroserviceForTest("auth");
	// Запускаем микросервис main
	const mainMicroservice = await startMicroserviceForTest("main");

	await app.init();

	const httpServer = app.getHttpServer();
	const authTestManger = new AuthTestManager(app);

	// TODO: delete all data from database for testing
	// await deleteAllData(app);

	return {
		app,
		httpServer,
		authTestManger,
		authMicroservice,
		mainMicroservice,
	};
};
