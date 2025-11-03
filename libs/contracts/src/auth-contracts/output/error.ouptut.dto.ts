import { ApiProperty } from "@nestjs/swagger";

export class ErrorMessage {
	@ApiProperty({ description: "Field", example: "userName" })
	field: string;

	@ApiProperty({ description: "Message", example: "User name must be between 6 and 30 characters" })
	message: string;
}

export class ValidationErrorDto {
	@ApiProperty({
		description: "Errors messages",
		type: [ErrorMessage],
		example: [
			{
				field: "value",
				message: "value must be correct",
			},
		],
	})
	errorsMessages: ErrorMessage[];
}
