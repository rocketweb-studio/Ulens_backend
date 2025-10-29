import { Module } from "@nestjs/common";
import { StripeModule } from "@payments/core/stripe/stripe.module";
import { WebhookController } from "@payments/modules/webhook/webhook.controller";
import { WebhookStripeService } from "@payments/modules/webhook/webhook-stripe.service";
import { PlanModule } from "@payments/modules/plan/plan.module";
import { TransactionModule } from "@payments/modules/transaction/transaction.module";
import { SubscriptionModule } from "@payments/modules/subscription/subscription.module";
import { WebhookPaypalService } from "@payments/modules/webhook/webhook-paypal.service";
import { EventStoreModule } from "@payments/modules/event-store/event-store.module";

@Module({
	imports: [StripeModule, PlanModule, TransactionModule, SubscriptionModule, EventStoreModule],
	controllers: [WebhookController],
	providers: [WebhookStripeService, WebhookPaypalService],
})
export class WebhookModule {}
