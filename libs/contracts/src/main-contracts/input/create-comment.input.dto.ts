import { Trim } from "@libs/contracts/utils/trim-pipe";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentInputDto {
	@ApiProperty({
		description: "Content",
		example: "This is a comment",
	})
	@IsString()
	@IsNotEmpty()
	@IsString()
	@MaxLength(500)
	@Trim()
	content: string;
}
