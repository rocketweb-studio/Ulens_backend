import { DefaultErrorResponse } from "@libs/constants/index";
import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiNoContentResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiNotFoundResponse } from "@nestjs/swagger";

export const DeleteProfileAvatarSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete profile avatar" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Profile avatar was successfully deleted" }),
		ApiNotFoundResponse({ description: "Profile avatar not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
