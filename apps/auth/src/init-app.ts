import { AppModule } from "@auth/app.module";
import { CoreEnvConfig } from "@auth/core/core.config";
import { DynamicModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

export const initAppModule = async (): Promise<{
	dynamicModule: DynamicModule;
	config: CoreEnvConfig;
}> => {
	// Создаем временный контекст приложения для получения конфигурации
	const appContext = await NestFactory.createApplicationContext(AppModule);

	// Извлекаем экземпляр конфигурации из контейнера зависимостей
	const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);

	// Закрываем временный контекст приложения
	await appContext.close();

	// Возвращаем динамический модуль с конфигурацией и саму конфигурацию
	return {
		dynamicModule: AppModule.forRoot(config), // Создаем модуль с предустановленной конфигурацией
		config, // Возвращаем конфигурацию для использования в main.ts
	};
};
