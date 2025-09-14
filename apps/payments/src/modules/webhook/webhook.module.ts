import { Module } from "@nestjs/common";
import { StripeModule } from "@payments/core/stripe/stripe.module";
import { WebhookController } from "@payments/modules/webhook/webhook.controller";
import { WebhookService } from "@payments/modules/webhook/webhook.service";
import { PlanModule } from "../plan/plan.module";
import { TransactionModule } from "../transaction/transaction.module";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
	imports: [StripeModule, PlanModule, TransactionModule, SubscriptionModule],
	controllers: [WebhookController],
	providers: [WebhookService],
})
export class WebhookModule {}
