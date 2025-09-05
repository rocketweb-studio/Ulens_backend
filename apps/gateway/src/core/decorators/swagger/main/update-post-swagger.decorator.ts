import { applyDecorators } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 * @response 403 - Forbidden
 * @response 404 - Not found
 */
export const UpdatePostSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Update post" }),
		ApiParam({ name: "postId", type: "string", format: "uuid" }),
		ApiNoContentResponse({ description: "The post has been successfully updated" }),
		ApiResponse(BadRequestResponse),
		ApiUnauthorizedResponse({ description: "If the refresh token is wrong or expired" }),
		ApiForbiddenResponse({ description: "You are not allowed to update this post" }),
		ApiNotFoundResponse({ description: "The post has not been found" }),
	];

	return applyDecorators(...decorators);
};
