import { SessionOutputDto } from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetSessionsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get sessions" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Sessions were successfully received", type: [SessionOutputDto] }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
