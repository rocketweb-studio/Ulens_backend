import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageInputDto {
	@ApiProperty({
		description: "Message text",
		example: "Hello, how are you?",
	})
	@IsString()
	@IsNotEmpty()
	content: string;
}
