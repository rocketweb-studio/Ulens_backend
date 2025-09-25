import { ApiProperty } from "@nestjs/swagger";

class SingleImageOutputDto {
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
		description: "Image created at",
		example: "2021-01-01T00:00:00.000Z",
	})
	createdAt: Date;
	@ApiProperty({
		description: "Image upload ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	uploadId: string;
}

export class AvatarImagesOutputDto {
	@ApiProperty({
		description: "Small avatar",
		type: SingleImageOutputDto,
	})
	small: SingleImageOutputDto | null;
	@ApiProperty({
		description: "Medium avatar",
		type: SingleImageOutputDto,
	})
	medium: SingleImageOutputDto | null;
}
