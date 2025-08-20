import { applyDecorators } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BadRequestResponse } from "../common/BadRequestResponse";

/**
 * @swagger
 * @response 204 - No content
 * @response 400 - Bad request
 * @response 429 - Too many requests
 */
export const RegistrationSwagger = () => {
	const decorators = [
		ApiOperation({
			summary: "Registrate a new user. Email with confirmation code will be send to passed email address.",
		}),
		ApiNoContentResponse({
			description: `An email with a verification code has been sent to the specified email address`,
		}),
		ApiResponse(BadRequestResponse),
	];

	return applyDecorators(...decorators);
};
