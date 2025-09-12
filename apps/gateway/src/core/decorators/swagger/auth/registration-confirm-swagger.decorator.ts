import { applyDecorators } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiResponse, ApiTooManyRequestsResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const RegistrationConfirmationSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Confirm registration" }),
		ApiNoContentResponse({
			description: "Email was verified. Account was activated",
		}),
		ApiResponse(BadRequestResponse),
		ApiTooManyRequestsResponse({
			description: "More than 5 attempts from one IP-address during 10 seconds",
		}),
	];

	return applyDecorators(...decorators);
};
