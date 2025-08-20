import { applyDecorators } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const PassRecoverySwagger = () => {
	const decorators = [
		ApiOperation({
			summary: "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
		}),
		ApiNoContentResponse({
			description: "An email with a recovery code has been sent to the specified email address",
		}),
		ApiResponse(BadRequestResponse),
	];

	return applyDecorators(...decorators);
};
