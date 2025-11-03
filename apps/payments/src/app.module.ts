import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { CoreModule } from "./core/core.module";
import { PlanModule } from "@payments/modules/plan/plan.module";
import { TransactionModule } from "@payments/modules/transaction/transaction.module";
import { WebhookModule } from "@payments/modules/webhook/webhook.module";
import { SubscriptionModule } from "@payments/modules/subscription/subscription.module";
import { EventStoreModule } from "@payments/modules/event-store/event-store.module";
import { PaymentsRabbitModule } from "@payments/modules/payments-rabbit/payments-rabbit.module";
@Module({
	imports: [CoreModule, PlanModule, TransactionModule, WebhookModule, SubscriptionModule, EventStoreModule, PaymentsRabbitModule],
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
