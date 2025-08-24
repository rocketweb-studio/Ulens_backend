import { EmailDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTooManyRequestsResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Recovery code passed verification
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const CheckRecoveryCodeSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Check recovery code for valid" }),
		ApiOkResponse({
			description: "Recovery code is valid",
			type: EmailDto,
		}),
		ApiResponse({
			status: 400,
			description: "If the recovery code is incorrect or already expired",
		}),
		ApiTooManyRequestsResponse({
			description: "More than 5 attempts from one IP-address during 10 seconds",
		}),
	];

	return applyDecorators(...decorators);
};
