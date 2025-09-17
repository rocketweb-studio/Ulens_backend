import { ProfileOutputWithAvatarDto } from "@libs/contracts/index";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { DefaultErrorResponse } from "@libs/constants/index";

export const GetProfileSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get profile" }),
		ApiOkResponse({ description: "Profile was successfully received", type: ProfileOutputWithAvatarDto }),
		ApiNotFoundResponse({ description: "Profile not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
