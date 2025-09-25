import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserPostsOutputDto } from "@libs/contracts/index";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const GetUserPostsSwagger = () => {
	const decorators = [
		ApiQuery({
			name: "pageSize",
			required: false,
			description: "page size is number of items that should be returned (min: 1, max: 8)",
			schema: { type: "integer", minimum: 1, maximum: 8, default: 8 },
		}),
		ApiOperation({ summary: "Get all posts by userId with pagination" }),
		ApiOkResponse({ description: "Success", type: UserPostsOutputDto }),
		ApiUnauthorizedResponse({ description: "If the refresh token is wrong or expired" }),
	];

	return applyDecorators(...decorators);
};
