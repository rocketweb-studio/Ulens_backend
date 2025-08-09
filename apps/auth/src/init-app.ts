import { NestFactory } from '@nestjs/core';
import { AuthModule } from '@/auth.module';
import { CoreEnvConfig } from '@/core/core.config';
import { DynamicModule } from '@nestjs/common';

export const initAppModule = async (): Promise<{ dynamicModule: DynamicModule; config: CoreEnvConfig }> => {
  // Создаем временный контекст приложения для получения конфигурации
  const appContext = await NestFactory.createApplicationContext(AuthModule);

  // Извлекаем экземпляр конфигурации из контейнера зависимостей
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);

  // Закрываем временный контекст приложения
  await appContext.close();

  // Возвращаем динамический модуль с конфигурацией и саму конфигурацию
  return {
    dynamicModule: AuthModule.forRoot(config), // Создаем модуль с предустановленной конфигурацией
    config // Возвращаем конфигурацию для использования в main.ts
  };
};
