import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig, Environments } from "@auth/core/core.config";
import { CoreModule } from "@auth/core/core.module";
import { UserModule } from "@auth/modules/user/user.module";
import { TestingModule } from "@auth/modules/testing/testing.module";
import { SessionModule } from "@auth/modules/session/session.module";
import { BlacklistModule } from "@auth/modules/blacklist/blacklist.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [CoreModule, UserModule, TestingModule, SessionModule, BlacklistModule, ScheduleModule.forRoot()],
	controllers: [],
	providers: [],
})
export class AppModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		// используем тестовый модуль только в тестовом окружении
		const testingModule: any[] = [];
		if (config.env === Environments.TESTING) {
			testingModule.push(TestingModule);
		}
		return {
			module: AppModule,
			imports: [CoreModule, UserModule, SessionModule, BlacklistModule, ...testingModule],
			controllers: [],
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}
