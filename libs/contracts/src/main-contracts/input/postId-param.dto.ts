import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class PostIdParamDto {
	@ApiProperty({ format: "uuid" })
	@IsUUID("4")
	postId: string;
}
