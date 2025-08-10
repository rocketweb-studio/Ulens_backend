import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { MockTestManager } from './mock-test-manager';
import { AppModule } from '../../src/app.module';
import { CoreEnvConfig } from '../../src/core/core.config';
import { configApp } from '../../src/app.setup';

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
    imports: [AppModule]
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
  const mockTestManger = new MockTestManager(app);

  // TODO: delete all data from database for testing
  // await deleteAllData(app);

  return {
    app,
    httpServer,
    mockTestManger
  };
};
