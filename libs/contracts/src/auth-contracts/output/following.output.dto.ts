import { ApiProperty } from "@nestjs/swagger";

export class FollowingOutputDto {
	@ApiProperty({ description: "Success", example: true })
	success: boolean;
}
