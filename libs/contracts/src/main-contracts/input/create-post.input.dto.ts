import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

// Create a DTO for the form data
export class CreatePostDto {
	@ApiProperty({
		description: "Description of the post",
		example: "This is a description of the post",
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	description: string;

	@ApiProperty({
		type: "array",
		items: {
			type: "string",
			format: "binary", // This is key for file uploads
		},
		description: "Images for the post",
	})
	images: any[];
}
