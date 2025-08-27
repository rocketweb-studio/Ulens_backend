import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTooManyRequestsResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully received user info
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const GoogleOathSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Login via Google OAuth" }),
		ApiOkResponse({ description: "Success, refresh token received as a cookie" }),
		ApiTooManyRequestsResponse({
			description: "More than 5 attempts from one IP-address during 10 seconds",
		}),
	];

	return applyDecorators(...decorators);
};
