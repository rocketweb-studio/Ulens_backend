import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@notifications/core/core.config";
import { CoreModule } from "@notifications/core/core.module";
import { EmailModule } from "@notifications/modules/mail/mail.module";
import { NotificationModule } from "@notifications/modules/notification/notification.module";
import { EventStoreModule } from "@notifications/modules/event-store/event-store.module";
import { NotificationRabbitModule } from "@notifications/modules/notification-rabbit/notification-rabbit.module";

@Module({
	imports: [CoreModule, EventStoreModule, EmailModule, NotificationModule, NotificationRabbitModule],
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
