import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { CoreModule } from "@auth/core/core.module";
import { UserModule } from "@auth/modules/user/user.module";
import { SessionModule } from "@auth/modules/session/session.module";
import { BlacklistModule } from "@auth/modules/blacklist/blacklist.module";
import { ProfileModule } from "@auth/modules/profile/profile.module";
import { AuthRabbitModule } from "@auth/modules/auth-rabbit/auth-rabbit.module";
import { EventStoreModule } from "@auth/modules/event-store/event-store.module";

@Module({
	imports: [CoreModule, UserModule, SessionModule, BlacklistModule, ProfileModule, AuthRabbitModule, EventStoreModule],
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
