import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const WebhookStripeSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Webhook stripe - Not for frontend, use only for stripe" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Webhook stripe" }),
	];

	return applyDecorators(...decorators);
};
