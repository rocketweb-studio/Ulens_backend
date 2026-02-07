import { ApiProperty } from "@nestjs/swagger";

export class LikePostOrCommentOutputDto {
	@ApiProperty({ description: "Success", example: true })
	success: boolean;
}
