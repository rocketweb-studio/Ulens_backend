import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { DefaultErrorResponse } from "@libs/constants/index";

export const LogoutSessionSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Logout session" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Session was successfully logged out" }),
		ApiNotFoundResponse({ description: "Session not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
