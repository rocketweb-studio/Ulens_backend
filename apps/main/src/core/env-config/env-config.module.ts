import { ConfigModule } from '@nestjs/config';

// MICROSERVICE_NAME NODE_ENV переменные добавляем в package.json в скриптах так как они не доступны до инициализации ConfigModule
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // local dev
    `apps/${process.env.MICROSERVICE_NAME}/.env.${process.env.NODE_ENV}.local`
  ],
  isGlobal: true
});

/**
 * Указывает, откуда брать переменные окружения (файлы), делает ConfigModule глобальным, подключается в CoreModule
 * 1.Создаем конфигурационный конфигурационный модуль, который NestJS будет использовать для загрузки
 *    переменных окружения (process.env)
 * 2.Явно указываем, какие .env файлы нужно загружать и в каком порядке
 *    Порядок важен! Как написано в документации: "If a variable is found in multiple files, the first one takes precedence."
 * На практике если мы запускаем e2e-тесты "cross-env NODE_ENV=testing jest --config ./apps/main/test/jest-e2e.json"
 *    тогда process.env.NODE_ENV === 'testing', и Nest попытается загрузить :
 *        1. apps/main/.env.testing.local
 *        2. .env.testing
 *        3. .env.production
 */
