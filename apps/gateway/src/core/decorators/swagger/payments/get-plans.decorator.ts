import { PlanOutputDto } from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const GetPlansSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get price plans" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Price plans were successfully received", type: [PlanOutputDto] }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
