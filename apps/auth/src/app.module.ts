import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { CoreModule } from "@auth/core/core.module";
import { UserModule } from "@auth/modules/user/user.module";
import { SessionModule } from "@auth/modules/session/session.module";
import { BlacklistModule } from "@auth/modules/blacklist/blacklist.module";
import { ScheduleModule } from "@nestjs/schedule";
import { RabbitModule } from "@libs/rabbit/index";

@Module({
	imports: [CoreModule, UserModule, SessionModule, BlacklistModule, ScheduleModule.forRoot(), RabbitModule],
	controllers: [],
	providers: [],
})
export class AppModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
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
