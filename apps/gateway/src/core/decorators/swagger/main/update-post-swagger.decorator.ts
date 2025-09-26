import { applyDecorators } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";
import { DefaultErrorResponse } from "@libs/constants/index";

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
		ApiBearerAuth(),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiForbiddenResponse({ description: "You are not allowed to update this post" }),
		ApiNotFoundResponse({ description: "The post has not been found", type: DefaultErrorResponse }),
	];

	return applyDecorators(...decorators);
};
