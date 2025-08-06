import { NestFactory } from '@nestjs/core';
import { initMainModule } from '@/init-main';
import { configApp } from './main.setup';
import { CoreEnvConfig } from './core/core.config';

async function bootstrap() {
  const dynamicAppModule = await initMainModule(); // 1

  const app = await NestFactory.create(dynamicAppModule);  // 2
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);  // 3

  configApp(app, config);  // 4

  await app.listen(config.applicationPort); // 5
}
bootstrap();

/**
 *1.initMainModule()
 *  - это не обычный AppModule, а динамический модуль, собранный в рантайме.
 *  - подключает зависимости, включая .env файлы.
 *  - расположен в: apps/main/src/init-main.ts
 *2.NestFactory.create(...)
 *  - Создаёт Nest-приложение на основе динамического модуля.
 *  - Это как new App(...), но по Nest-стандарту.
 *3.app.get(CoreEnvConfig)
 *  - В NestJS у объекта app (инстанс приложения INestApplication) есть метод get, который используется 
 *        для получения зарегистрированного провайдера (сервиса, класса, токена и т.д.).
 *  - <CoreEnvConfig> — мы указываем тип, который хотим получить, т.е. мы говорим компилятору: "ожидается объект типа CoreEnvConfig". 
 *  - app.get(...) — вызывает метод, который возвращает экземпляр зарегистрированного провайдера.
 *  - CoreEnvConfig (внутри скобок) — это токен. Чаще всего это сам класс, использующийся как токен при регистрации провайдера.
 *  - Результат сохраняется в переменную config
 * 
 *  - Достаёт конфигурационный сервис, где уже загружены .env переменные.
 *  - Именно здесь уже доступны переменные из .env.testing.local, если NODE_ENV=testing.
 *4.configApp(app, config)
 *  - Файл main.setup.ts.
 *  - Здесь регистрируются middlewares, глобальный префикс, фильтры ошибок, CORS и т.п.
 *5.app.listen(...)
 *  - Запускает сервер, например на http://localhost:3000.
 */
