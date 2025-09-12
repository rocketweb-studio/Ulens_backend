import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTooManyRequestsResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully received user info
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const GitHubOathSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Login via GitHub OAuth" }),
		ApiOkResponse({ description: "Success, refresh token received as a cookie" }),
		ApiTooManyRequestsResponse({
			description: "More than 5 attempts from one IP-address during 10 seconds",
		}),
	];

	return applyDecorators(...decorators);
};
