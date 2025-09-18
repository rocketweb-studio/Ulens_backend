import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const WebhookPayPalSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Webhook paypal - Not for frontend, use only for paypal" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Webhook paypal" }),
	];

	return applyDecorators(...decorators);
};
