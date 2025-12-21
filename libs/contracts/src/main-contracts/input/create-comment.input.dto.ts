import { Trim } from "@libs/contracts/utils/trim-pipe";
import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";
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

	@ApiProperty({
		description: "Reply to comment id",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsString()
	@IsOptional()
	@Trim()
	replyToCommentId?: string;
}
