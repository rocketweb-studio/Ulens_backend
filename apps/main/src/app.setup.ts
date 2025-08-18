import { INestApplication } from '@nestjs/common';
import { CoreEnvConfig } from '@main/core/core.config';

/**
 * настройка приложения, например: глобальный префикс, pipes, CORS, Swagger, etc.
 * eslint-disable-next-line @typescript-eslint/no-unused-vars
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function configApp(app: INestApplication, coreConfig: CoreEnvConfig) {
  /**
   * используем coreConfig при необходимости, например:
   * if (coreConfig.isSwaggerEnabled) {
   *   swaggerSetup(app);
   * }
   */
}
