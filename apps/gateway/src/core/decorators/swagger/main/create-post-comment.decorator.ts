import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";
import { CommentOutputDto } from "@libs/contracts/index";

/**
 * @swagger
 * @response 201 - Created
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const CreatePostCommentSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Create post comment" }),
		ApiCreatedResponse({
			description: "The post comment has been successfully created. The response body contains the post comment data",
			type: CommentOutputDto,
		}),
		ApiBearerAuth(),
		ApiResponse(BadRequestResponse),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
