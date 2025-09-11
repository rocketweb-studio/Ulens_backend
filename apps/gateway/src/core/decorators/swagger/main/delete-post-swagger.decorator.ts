import { applyDecorators } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

/**
 * @swagger
 * @response 204 - No content
 * @response 401 - Unauthorized
 * @response 403 - Forbidden
 * @response 404 - Not found
 */
export const DeletePostSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete post" }),
		ApiParam({ name: "postId", type: "string", format: "uuid" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "The post has been successfully deleted" }),
		ApiUnauthorizedResponse({ description: "If the refresh token is wrong or expired" }),
		ApiForbiddenResponse({ description: "You are not allowed to delete this post" }),
		ApiNotFoundResponse({ description: "The post has not been found" }),
	];

	return applyDecorators(...decorators);
};
