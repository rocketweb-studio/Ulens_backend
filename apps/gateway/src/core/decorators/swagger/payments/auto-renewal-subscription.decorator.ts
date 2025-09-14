import { ValidationErrorDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const AutoRenewalSubscriptionSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Auto renewal subscription" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Auto renewal subscription was successfully updated" }),
		ApiBadRequestResponse({ description: "Bad request", type: ValidationErrorDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
