import { SearchUsersOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully received user info
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const GetUsersBySearchSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get users by search" }),
		ApiOkResponse({ description: "Successfully received users by search", type: SearchUsersOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
