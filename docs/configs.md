# Конфигурация окружения: типизированный и валидируемый подход

В NestJS работа с переменными окружения организована через встроенный пакет [`@nestjs/config`](https://docs.nestjs.com/techniques/configuration).
Как правило, это происходит следующим образом:

## 1. Настраиваем путь к env файлу

```typescript
export const configModule = ConfigModule.forRoot({
	envFilePath: [
		`.env.${process.env.NODE_ENV}.local`,
	],
	isGlobal: true,
});
```

## 2. Используем переменные в коде

```typescript
const port = configService.get<number>('PORT');
```

## Минусы такой реализации:

- Не гарантирует наличие переменной
- Не валидирует её значение
- Не даёт автодополнение в IDE
- Не централизует конфигурацию

## Решение

Для решения этих проблем мы реализуем классы с конфигурациями для каждого модуля, где необходимо использовать переменные окружения.
Также имеет место подход, где мы используем одну конфигурацию на все приложение/микросервис.

### Пример конфигурационного класса:

```typescript
@Injectable()
export class CoreEnvConfig {
	@IsNotEmpty({
		message: "Set Env variable AUTH_POSTGRES_URL, example: postgresql://user:password@host:port/database",
	})
	databaseUrl: string;

	@IsString()
	@IsNotEmpty({
		message: "Set Env variable AUTH_TCP_HOST, example: 0.0.0.0",
	})
	tcpHost: string;

	@IsNotEmpty({
		message: "Set Env variable AUTH_TCP_PORT, example: 3001",
	})
	tcpPort: number;

	constructor(private configService: ConfigService<any, true>) {
		this.databaseUrl = this.configService.get<string>("AUTH_POSTGRES_URL");
		this.tcpHost = this.configService.get<string>("AUTH_TCP_HOST");
		this.tcpPort = this.configService.get<number>("AUTH_TCP_PORT");

		configValidationUtility.validateConfig(this);
	}
}
```

### Преимущества такого подхода:

1. Этот класс получает значения из `ConfigService`
2. Валидирует их через `class-validator` 
3. Делает переменные доступными как свойства	
4. IDE подсказывает названия и типы
5. Все переменные в одном месте
6. Ошибка при запуске, если переменная не задана
7. Легко мокать в тестах

## Использование в модулях:

### 1. Создать конфиг-класс
### 2. Зарегистрировать его в модуле

```typescript
@Module({
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig], // либо не экспортируем если используем только внутри модуля, редкий кейс
})
export class CoreModule {}
```

### 3. Использовать через DI:

```typescript
constructor(private readonly coreConfig: CoreEnvConfig) {
  console.log(coreConfig.applicationPort);
	console.log(coreConfig.databaseUrl);
}
```

## Функция `configValidationUtility.validateConfig(this)` в конфигах

Эта утилита вызывается в классе конфигурации. Основные функции:

1. **Валидация конфиг-классов** при старте приложения с помощью `class-validator`, проверяет, что все переменные окружения заданы и корректны
2. **Обработка ошибок** — если есть ошибки, собирает все сообщения и выбрасывает `Error`
3. **Преобразование типов** — преобразует строки в `boolean` для флагов, так как если мы в переменную передаем `true`/`false`, то эти значения приходят строкой, а не булевым выражением
4. **Работа с enum** — возвращает массив значений из enum, если мы хотим ограничить переменную значениями из enum, например `NODE_ENV`
