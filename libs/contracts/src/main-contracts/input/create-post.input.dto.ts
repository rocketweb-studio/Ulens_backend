import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreatePostDto {
	@ApiProperty({
		maxLength: 500,
		description: "Description of the post",
		example: "This is a description of the post",
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	description: string;
}
