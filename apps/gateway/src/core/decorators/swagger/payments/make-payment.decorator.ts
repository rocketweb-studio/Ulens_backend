import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { PaymentOutputDto } from "@libs/contracts/index";

export const MakePaymentSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Make payment" }),
		ApiBearerAuth(),
		ApiCreatedResponse({ description: "Return redirect URL for payment", type: PaymentOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
