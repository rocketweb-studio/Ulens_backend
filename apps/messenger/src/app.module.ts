import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@messenger/core/core.config";
import { CoreModule } from "@messenger/core/core.module";
import { EventStoreModule } from "@messenger/modules/event-store/event-store.module";
import { MessengerModule } from "@messenger/modules/messenger/messenger.module";

@Module({
	imports: [CoreModule, EventStoreModule, MessengerModule],
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
