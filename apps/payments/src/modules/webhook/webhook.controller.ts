import { Controller } from "@nestjs/common";
import { WebhookStripeService } from "./webhook-stripe.service";
import { PaymentsMessages } from "@libs/constants/payment-messages";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class WebhookController {
	constructor(private readonly webhookService: WebhookStripeService) {}

	@MessagePattern({ cmd: PaymentsMessages.WEBHOOK_STRIPE })
	async receiveWebhookStripe(@Payload() payload: { rawBody: any; stripeSignature: string }) {
		const { rawBody, stripeSignature } = payload;
		const rawBodyBuffer = Buffer.from(rawBody, "utf8");
		const event = await this.webhookService.constructStripeEvent(rawBodyBuffer, stripeSignature);
		await this.webhookService.receiveWebhookStripe(event);
		return {
			message: "Webhook received",
		};
	}
}
