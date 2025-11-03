import { Controller } from "@nestjs/common";
import { WebhookStripeService } from "@payments/modules/webhook/webhook-stripe.service";
import { PaymentsMessages } from "@libs/constants/payment-messages";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { WebhookPaypalService } from "@payments/modules/webhook/webhook-paypal.service";

@Controller()
export class WebhookController {
	constructor(
		private readonly webhookStripeService: WebhookStripeService,
		private readonly webhookPaypalService: WebhookPaypalService,
	) {}

	@MessagePattern({ cmd: PaymentsMessages.WEBHOOK_STRIPE })
	async receiveWebhookStripe(@Payload() payload: { rawBody: any; stripeSignature: string }) {
		const { rawBody, stripeSignature } = payload;
		const rawBodyBuffer = Buffer.from(rawBody, "utf8");
		const event = await this.webhookStripeService.constructStripeEvent(rawBodyBuffer, stripeSignature);
		await this.webhookStripeService.receiveWebhookStripe(event);
		return {
			message: "Webhook received",
		};
	}

	@MessagePattern({ cmd: PaymentsMessages.WEBHOOK_PAYPAL })
	async receiveWebhookPayPal(@Payload() payload: { eventType: string; resource: any }) {
		const { eventType, resource } = payload;
		await this.webhookPaypalService.receiveWebhookPayPal(eventType, resource);
		return {
			message: "Webhook received",
		};
	}
}
