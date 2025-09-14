import { SubscriptionOutputDto } from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetCurrentSubscriptionSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get current subscription" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Current subscription was successfully received", type: SubscriptionOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
