import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { UserTestManager } from "./user-test-manager";
import { AppModule } from "../../src/app.module";

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
		imports: [AppModule],
	});

	if (addSettingsToModuleBuilder) {
		addSettingsToModuleBuilder(testingModuleBuilder);
	}

	const testingAppModule = await testingModuleBuilder.compile();

	const app = testingAppModule.createNestApplication();

	await app.init();

	const httpServer = app.getHttpServer();
	const userTestManger = new UserTestManager(app);

	return {
		app,
		httpServer,
		userTestManger,
	};
};
