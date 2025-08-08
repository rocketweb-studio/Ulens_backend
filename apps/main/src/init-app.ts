import { NestFactory } from '@nestjs/core';
import { MainModule } from '@/main.module';
import { DynamicModule } from '@nestjs/common';
import { CoreEnvConfig } from './core/core.config';

//  Динамический модуль, для того чтобы можно было использовать разные модули в зависимости от окружения
export const initAppModule = async (): Promise<{ dynamicModule: DynamicModule; config: CoreEnvConfig }> => {
  const appContext = await NestFactory.createApplicationContext(MainModule); // 1
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig); // 2
  await appContext.close(); // 3

  return {
    dynamicModule: MainModule.forRoot(config),
    config
  }; // 4 / 5
};

/**
 * 1.Создаётся контекст приложения, но без запуска HTTP-сервера.Это нужно, чтобы получить доступ к конфигурации .env
 *    до создания основного Nest-приложения.
 * Эта стадия:
 * - Загружает все зависимости MainModule
 * - Подключает .env (через CoreEnvConfig)
 * - Инициализирует DI-контейнер
 * 2.Из DI контейнера достаётся сервис CoreEnvConfig — это обёртка вокруг process.env.
 *  Этот класс умеет, например:
 *  - загружать .env.testing.local, .env.production и т.п.
 *  - валидировать переменные
 *  - отдавать applicationPort, dbUrl и др.
 * 3.Контекст приложения больше не нужен — его закрывают, чтобы не висел в памяти.
 * 4.Вызывается фабричный метод forRoot(config), который возвращает полноценный DynamicModule.
 * 5.Возвращается объект с динамическим модулем и конфигурацией.
 */
