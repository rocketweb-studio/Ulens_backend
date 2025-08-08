import { ConfigModule } from '@nestjs/config';

// 1
export const configModule = ConfigModule.forRoot({
  // 2
  envFilePath: [
    // local dev
    `apps/main/.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.production'
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
