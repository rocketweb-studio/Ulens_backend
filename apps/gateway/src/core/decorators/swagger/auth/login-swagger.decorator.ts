import { AccessTokenDto } from "@libs/contracts/auth-contracts/output/access-token.dto";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * Swagger decorator for auth POST endpoints that can return 429 Too many requests
 * @swagger
 * @response 200 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const LoginSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Login user" }),
		ApiOkResponse({
			description: "User was successfully logged in",
			type: AccessTokenDto,
		}),
		ApiUnauthorizedResponse({
			description: "If the password or login or email is wrong",
		}),
	];

	return applyDecorators(...decorators);
};
