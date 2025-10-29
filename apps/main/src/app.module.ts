import { DynamicModule, Module } from "@nestjs/common";
import { CoreModule } from "@main/core/core.module";
import { CoreEnvConfig } from "@main/core/core.config";
import { PostModule } from "@main/modules/post/post.module";
import { PostRabbitModule } from "@main/modules/post-rabbit/post-rabbit.module";
import { EventStoreModule } from "@main/modules/event-store/event-store.module";
@Module({
	// 1
	imports: [CoreModule, PostModule, PostRabbitModule, EventStoreModule], // 2
	controllers: [],
	providers: [],
})
export class AppModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		// 3
		return {
			module: AppModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
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
