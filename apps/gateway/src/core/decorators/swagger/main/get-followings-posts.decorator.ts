import { UserPostsOutputDto } from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetFollowingsPostsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get followings posts" }),
		ApiOkResponse({ description: "Followings posts were successfully received", type: UserPostsOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
