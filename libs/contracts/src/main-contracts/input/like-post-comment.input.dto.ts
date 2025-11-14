import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum LikedItemType {
	POST = "POST",
	COMMENT = "COMMENT",
}

export class LikePostOrCommentInputDto {
	@ApiProperty({ description: "Type of the liked item", example: LikedItemType.POST, enum: LikedItemType })
	@IsEnum(LikedItemType)
	@IsNotEmpty()
	likedItemType: LikedItemType;

	@ApiProperty({ description: "Id of the liked item", example: "eecb0d2b-1d86-4554-9cb5-a0980c9cf4be" })
	@IsString()
	@IsNotEmpty()
	likedItemId: string;

	@ApiProperty({ description: "Whether the user liked the item", example: true })
	@IsBoolean()
	@IsNotEmpty()
	like: boolean;
}
