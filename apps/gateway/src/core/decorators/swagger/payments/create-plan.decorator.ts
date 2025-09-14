import { PlanOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const CreatePlanSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Create price plan" }),
		ApiBearerAuth(),
		ApiCreatedResponse({ description: "Price plan was successfully created", type: PlanOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
