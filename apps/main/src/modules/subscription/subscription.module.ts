import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@main/core/core.config";
import { CoreModule } from "@main/core/core.module";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";

@Module({
	imports: [CoreModule],
	controllers: [SubscriptionController],
	providers: [SubscriptionService],
	exports: [SubscriptionService],
})
export class SubscriptionModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		return {
			module: SubscriptionModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}
