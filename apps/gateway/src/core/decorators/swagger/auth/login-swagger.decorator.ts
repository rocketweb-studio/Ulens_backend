import { AccessTokenDto } from "@libs/contracts/auth-contracts/output/access-token.dto";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully logged in
 * @response 400 - Bad request
 * @response 401 - Unauthorized
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
		ApiTooManyRequestsResponse({
			description: "More than 5 attempts from one IP-address during 10 seconds",
		}),
	];

	return applyDecorators(...decorators);
};
