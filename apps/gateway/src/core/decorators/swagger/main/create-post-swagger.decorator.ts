import { applyDecorators } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const CreatePostSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Create post" }),
		ApiNoContentResponse({
			description: "The post has been successfully created. The response body contains the post data",
		}),
		ApiResponse(BadRequestResponse),
		ApiUnauthorizedResponse({ description: "If the refresh token is wrong or expired" }),
	];

	return applyDecorators(...decorators);
};
