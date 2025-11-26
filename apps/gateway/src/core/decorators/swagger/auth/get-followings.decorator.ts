import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { GetFollowingsOutputDto } from "@libs/contracts/index";

export const GetFollowingsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get followings" }),
		ApiOkResponse({ description: "Followings were successfully received", type: GetFollowingsOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
