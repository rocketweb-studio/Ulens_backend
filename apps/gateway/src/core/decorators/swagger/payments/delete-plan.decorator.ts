import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const DeletePlanSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete price plan" }),
		ApiParam({ name: "id", type: "string", format: "uuid" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Price plan was successfully deleted" }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
