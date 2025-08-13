import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { formatValidationErrors } from '@libs/utils/index';
import { CoreEnvConfig } from '@/core/core.config';
import { GatewayExceptionFilter } from './core/exeptions/filters/exeption.filter';

export function configApp(app: INestApplication, config: CoreEnvConfig) {
  // Setting Swagger
  const swaggerConfig = new DocumentBuilder().setTitle('RocketwebApp')
      .setDescription('The best API documentation ever!')
      .setVersion('1.0.0')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //и методы классов dto
      transform: true, // транформирует данные по типам, например если приходит uri параметр id строкой но указать тип number то он автоматически трансформирует в число
      //Выдавать первую ошибку для каждого поля если их много
      stopAtFirstError: true,
      //получить все ошибки и обработать более кастомно
      exceptionFactory: errors => {
        const formattedErrors = formatValidationErrors(errors);
        // throw new BadRequestDomainException(formattedErrors);
        throw new BadRequestException(formattedErrors);
      }
    })
  );

  app.useGlobalFilters(new GatewayExceptionFilter(config));

  app.setGlobalPrefix('api/v1');

  // app.enableCors({
  //   origin: '*',
  // });
}
