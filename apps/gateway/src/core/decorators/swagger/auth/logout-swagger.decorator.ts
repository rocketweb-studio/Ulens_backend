import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * Swagger decorator for auth POST endpoints that can return 429 Too many requests
 * @swagger
 * @response 200 - No content
 * @response 400 - Bad request
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
