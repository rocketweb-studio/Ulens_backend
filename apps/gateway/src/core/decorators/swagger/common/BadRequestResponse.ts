import { ApiResponseOptions } from "@nestjs/swagger";

export const BadRequestResponse: ApiResponseOptions = {
	status: 400,
	description: "Bad request",
	schema: {
		example: {
			errorMessages: [
				{
					message: "Value must be a valid",
					field: "value",
				},
			],
		},
	},
};
