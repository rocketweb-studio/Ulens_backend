import { FilesSizes } from "@libs/contracts/auth-contracts/output/image.ouptut.dto";
import { ApiProperty } from "@nestjs/swagger";

export enum MessageImgType {
	IMAGE = "IMAGE",
	AUDIO = "AUDIO",
}
export class MessageImgDto {
	@ApiProperty({
		description: "Image ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;
	@ApiProperty({
		description: "Message ID",
		example: 1,
	})
	messageId: number | null;
	@ApiProperty({
		description: "Image URL",
		example: "bucket/image.webp",
	})
	url: string;
	@ApiProperty({
		description: "Image width",
		example: 192,
	})
	width: number;
	@ApiProperty({
		description: "Image height",
		example: 192,
	})
	height: number;
	@ApiProperty({
		description: "Image file size",
		example: 100000,
	})
	fileSize: number;
	@ApiProperty({
		description: "Image size",
		example: "small",
		enum: FilesSizes,
		enumName: "FilesSizes",
	})
	size: FilesSizes;
	@ApiProperty({
		description: "Message media type",
		example: MessageImgType.IMAGE,
		enum: MessageImgType,
		enumName: "MessageImgType",
	})
	type: MessageImgType;
}

export class MessageImgOutputDto {
	@ApiProperty({
		description: "Message images",
		type: [MessageImgDto],
	})
	readonly files: MessageImgDto[];
}
