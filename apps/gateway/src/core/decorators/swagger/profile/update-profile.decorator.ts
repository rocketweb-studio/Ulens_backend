import { ProfileOutputDto, ValidationErrorDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse, ApiBearerAuth, ApiBadRequestResponse } from "@nestjs/swagger";

export const UpdateProfileSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Update profile" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Profile was successfully updated", type: ProfileOutputDto }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBadRequestResponse({ description: "Bad request", type: ValidationErrorDto }),
	];

	return applyDecorators(...decorators);
};
