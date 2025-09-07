import { ProfileOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const UpdateProfileSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Update profile" }),
		ApiOkResponse({ description: "Profile was successfully updated", type: ProfileOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
