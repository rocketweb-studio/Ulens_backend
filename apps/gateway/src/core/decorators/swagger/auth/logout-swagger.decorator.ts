import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const LogoutSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Logout user" }),
		ApiNoContentResponse({ description: "User was successfully logged out" }),
		ApiUnauthorizedResponse({
			description: "If the refresh token is wrong or expired",
		}),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
