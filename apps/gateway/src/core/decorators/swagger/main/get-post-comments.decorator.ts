import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";
import { CommentOutputDto } from "@libs/contracts/index";

/**
 * @swagger
 * @response 201 - Created
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const GetPostCommentsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get post comments" }),
		ApiOkResponse({
			description: "The post comments has been successfully received. The response body contains the post comments data",
			type: CommentOutputDto,
		}),
		ApiBearerAuth(),
		ApiResponse(BadRequestResponse),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
