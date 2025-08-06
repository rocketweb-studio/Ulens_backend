import { DynamicModule, Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { MockModule } from './modules/mock/mock.module';
import { CoreEnvConfig } from './core/core.config';

@Module({   // 1
  imports: [CoreModule, MockModule],  // 2
  controllers: [],
  providers: []
})
export class MainModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {  // 3
    return {
      module: MainModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}

/**
 * 1.При помощи @Module мы декорируем MainModule метаинформацией о его составе.
 * NestJS потом использует этот класс MainModule как "контейнер", который включает:
 *   -импортированные модули (CoreModule, MockModule)
 *   -контроллеры
 *   -провайдеры
 * 2.Подключает:
 *  CoreModule — базовые зависимости, включая конфиги, Prizma, GraphQL и т.д.
 *  MockModule -  временный модуль
 * 3.Возвращает DynamicModule, то есть можно передать параметры внутрь модуля (config)
 *      return MainModule.forRoot(config) -- вызов forRoot(config) и есть тот момент, когда мы передаём параметры внутрь модуля
 *   Переопределяет провайдер CoreEnvConfig:
 *      -Вместо того чтобы Nest сам создавал CoreEnvConfig (через constructor и ConfigService),
 *      -Мы вручную передаём уже готовый config (созданный в initMainModule)
 *      -Это позволяет не пересоздавать конфигурацию и использовать уже валидированный конфиг
 */
