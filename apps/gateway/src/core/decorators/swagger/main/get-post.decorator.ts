import { DefaultErrorResponse } from "@libs/constants/index";
import { PostOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const GetPostSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get post by id" }),
		ApiOkResponse({ description: "Post was successfully received", type: PostOutputDto }),
		ApiNotFoundResponse({ description: "Post not found", type: DefaultErrorResponse }),
	];

	return applyDecorators(...decorators);
};
