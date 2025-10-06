import { UsersCountOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Successfully received user info
 * @response 401 - Unauthorized
 * @response 429 - Too many requests
 */
export const GetUsersCountSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get users count" }),
		ApiOkResponse({ description: "Successfully received users count", type: UsersCountOutputDto }),
	];

	return applyDecorators(...decorators);
};
