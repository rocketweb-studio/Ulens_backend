import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";
import { CreatePostOutputDto } from "@libs/contracts/index";

/**
 * @swagger
 * @response 201 - Created
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const CreatePostSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Create post" }),
		ApiCreatedResponse({
			description: "The post has been successfully created. The response body contains the post data",
			type: CreatePostOutputDto,
		}),
		ApiBearerAuth(),
		ApiResponse(BadRequestResponse),
		ApiUnauthorizedResponse({ description: "If the refresh token is wrong or expired" }),
	];

	return applyDecorators(...decorators);
};
