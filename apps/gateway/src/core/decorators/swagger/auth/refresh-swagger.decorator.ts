import { AccessTokenDto } from "@libs/contracts/auth-contracts/output/access-token.dto";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * Swagger decorator for auth POST endpoints that can return 429 Too many requests
 * @swagger
 * @response 200 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const RefreshSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Generate new pair of jwt tokens" }),
		ApiOkResponse({
			description: "Token pair was successfully refreshed",
			type: AccessTokenDto,
		}),
		ApiUnauthorizedResponse({
			description: "If the refresh token is wrong or expired",
		}),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
