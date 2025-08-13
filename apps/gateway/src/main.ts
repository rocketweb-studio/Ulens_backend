import { NestFactory } from '@nestjs/core';
import { CoreEnvConfig } from '@/core/core.config';
import { initGatewayModule } from '@/init-app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorType } from './common/types/types';
import { HttpExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const dynamicAppModule = await initGatewayModule();

  const app = await NestFactory.create(dynamicAppModule);
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  // Setting Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RocketwebApp')
    .setDescription('The best API documentation ever!')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/swagger', app, document);

  //Setting Validation
  app.useGlobalPipes(new ValidationPipe({
    // transform: true,   /*used to transform uri params into number where it's nessesary without using ParseIntPipe*/
    stopAtFirstError: true,   // used to stop at first error
    exceptionFactory: (errors) => {   // this logic written for returnin name of the field where our mistake occurs
      const errorsForResponse: ErrorType[] = [];
      errors.forEach((e) => {
        const constraintKeys = Object.keys(e.constraints!);
        constraintKeys.forEach((ckey) => {
          errorsForResponse.push({
            message: e.constraints![ckey],
            field: e.property
          })
        })
      })
      throw new BadRequestException(errorsForResponse)
    }
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api/v1');

  await app.listen(config.applicationPort);
  console.log(`Gateway is running on port ${config.applicationPort}`);
}
bootstrap();
