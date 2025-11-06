import { FollowingOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const UnfollowSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Unfollow user" }),
		ApiOkResponse({ description: "Successfully unfollowed user", type: FollowingOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
