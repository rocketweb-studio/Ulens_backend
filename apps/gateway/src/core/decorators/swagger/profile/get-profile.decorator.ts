import { ProfileOutputWithAvatarDto } from "@libs/contracts/index";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetProfileSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get profile" }),
		ApiOkResponse({ description: "Profile was successfully received", type: ProfileOutputWithAvatarDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
