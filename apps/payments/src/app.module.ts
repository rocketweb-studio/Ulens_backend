import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { CoreModule } from "./core/core.module";
import { RabbitModule } from "@libs/rabbit/index";
import { SubscriptionModule } from "./modules/subscriptions/subscription.module";
@Module({
	imports: [CoreModule, RabbitModule, SubscriptionModule],
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
