import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiNoContentResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const DeleteProfileAvatarSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete profile avatar" }),
		ApiNoContentResponse({ description: "Profile avatar was successfully deleted" }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
