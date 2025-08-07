import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { UserTestManager } from './user-test-manager';
import { CoreEnvConfig } from '../../src/core/core.config';
import { configApp } from '../../src/app.setup';
import { AuthModule } from '../../src/auth.module';

/**
 * initSettings служит для создания отдельного инстэнса нашего приложения и выполнения в нем тестов
 *    и использования переменных окружения среды из .env.testing.local
 */

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void
) => {
  // создаем тестовый модуль и можем конфигурировать его
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AuthModule]
  });

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();
  const coreConfig = app.get<CoreEnvConfig>(CoreEnvConfig);

  configApp(app, coreConfig);

  await app.init();

  const httpServer = app.getHttpServer();
  const userTestManger = new UserTestManager(app);

  // TODO: delete all data from database for testing
  // await deleteAllData(app);

  return {
    app,
    httpServer,
    userTestManger
  };
};
