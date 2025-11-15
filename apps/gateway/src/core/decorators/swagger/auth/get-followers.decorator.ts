import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { GetFollowersOutputDto } from "@libs/contracts/index";

export const GetFollowersSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get followers" }),
		ApiOkResponse({ description: "Followers were successfully received", type: GetFollowersOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};
