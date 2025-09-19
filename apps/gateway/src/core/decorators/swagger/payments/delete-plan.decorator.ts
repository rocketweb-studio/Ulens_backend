import { DefaultErrorResponse } from "@libs/constants/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const DeletePlanSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Delete price plan", description: "Delete price plan - NOT FOR FRONTEND, USE ONLY FOR ADMIN" }),
		ApiParam({ name: "id", type: "string", format: "uuid" }),
		ApiBearerAuth(),
		ApiNoContentResponse({ description: "Price plan was successfully deleted" }),
		ApiNotFoundResponse({ description: "Price plan not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
