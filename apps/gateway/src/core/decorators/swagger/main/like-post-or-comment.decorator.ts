import { LikePostOrCommentOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse, ApiCreatedResponse } from "@nestjs/swagger";

export const LikePostOrCommentSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Like post or comment" }),
		ApiCreatedResponse({ description: "Success", type: LikePostOrCommentOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];
	return applyDecorators(...decorators);
};
