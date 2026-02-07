import { FollowingOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const FollowSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Follow user" }),
		ApiOkResponse({ description: "Successfully followed user", type: FollowingOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
