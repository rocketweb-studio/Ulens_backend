import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const ReadNotificationSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Read notifications" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Notifications were successfully read" }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
