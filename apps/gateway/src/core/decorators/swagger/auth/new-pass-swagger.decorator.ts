import { applyDecorators } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const NewPasswordSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Set new password" }),
		ApiNoContentResponse({
			description: "New password was successfully set",
		}),
		ApiResponse(BadRequestResponse),
	];

	return applyDecorators(...decorators);
};
