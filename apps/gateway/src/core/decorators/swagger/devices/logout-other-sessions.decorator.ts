import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const LogoutOtherSessionsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Logout other sessions" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Other sessions were successfully logged out" }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
