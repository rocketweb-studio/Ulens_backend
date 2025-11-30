import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FollowingInputDto {
	@ApiProperty({
		type: "string",
		format: "uuid",
		description: "User id for follow or unfollow",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsString()
	@IsNotEmpty()
	userId: string;
}
