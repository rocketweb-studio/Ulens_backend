import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiNoContentResponse, ApiUnauthorizedResponse, ApiBearerAuth } from "@nestjs/swagger";

export const DeleteProfileSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete profile - TEST ENDPOINT, DELETE IS NOT REQUIRED BY TECHNICAL REQUIREMENTS" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Profile was successfully deleted" }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
