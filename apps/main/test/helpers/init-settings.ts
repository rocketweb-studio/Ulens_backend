import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { MockTestManager } from './mock-test-manager';
import { MainModule } from '../../src/main.module';
import { CoreEnvConfig } from '../../src/core/core-env.config';
import { configApp } from '../../src/main.setup';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void
) => {
  // создаем тестовый модуль и можем конфигурировать его
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [MainModule]
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
