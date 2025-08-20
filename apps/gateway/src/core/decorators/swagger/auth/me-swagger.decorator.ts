import { MeUserViewDto } from "@libs/contracts/auth-contracts/output/me-user-view.dto";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully received user info
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const MeSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get info about current user" }),
		ApiOkResponse({ description: "Successfully received user info", type: MeUserViewDto }),
		ApiUnauthorizedResponse({
			description: "If the refresh token is wrong or expired",
		}),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
