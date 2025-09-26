import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PostOutputDto } from "@libs/contracts/index";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const GetLastPostsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get 5 last published posts" }),
		ApiOkResponse({ description: "Success", type: [PostOutputDto] }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
