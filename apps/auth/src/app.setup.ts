import { INestApplication } from '@nestjs/common';
import { CoreEnvConfig } from '@auth/core/core.config';

/**
 * настройка приложения, например: глобальный префикс, pipes, CORS, Swagger, etc.
 * eslint-disable-next-line @typescript-eslint/no-unused-vars
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function configApp(app: INestApplication, coreConfig: CoreEnvConfig) {
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     stopAtFirstError: true,
  //     exceptionFactory: (errors) => {
  //       const formattedErrors = formatValidationErrors(errors);
  //       throw new BadRequestException(formattedErrors);
  //     }
  //   })
  // );
  // app.useGlobalFilters(new RpcExceptionFilter(coreConfig));
}
