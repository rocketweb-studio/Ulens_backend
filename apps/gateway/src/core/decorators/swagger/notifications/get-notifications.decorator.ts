import { NotificationsOutputDto } from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetNotificationsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get notifications for last 30 days" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Notifications were successfully received", type: [NotificationsOutputDto] }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
