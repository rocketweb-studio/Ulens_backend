import { ApiProperty } from "@nestjs/swagger";

class SmallImageOutputDto {
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

class MediumImageOutputDto {
	@ApiProperty({
		description: "Image URL",
		example: "bucket/image.webp",
	})
	url: string;
	@ApiProperty({
		description: "Image width",
		example: 512,
	})
	width: number;
	@ApiProperty({
		description: "Image height",
		example: 512,
	})
	height: number;
	@ApiProperty({
		description: "Image file size",
		example: 300000,
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
class PostImagesOutputDto {
	@ApiProperty({
		description: "Small images",
		type: [SmallImageOutputDto],
	})
	small: SmallImageOutputDto[];
	@ApiProperty({
		description: "Medium images",
		type: [MediumImageOutputDto],
	})
	medium: MediumImageOutputDto[];
}

export class LocationDto {
	@ApiProperty({ example: "Minsk", nullable: true })
	city: string | null;

	@ApiProperty({ example: "Belarus", nullable: true })
	country: string | null;

	@ApiProperty({ example: "Minsky", nullable: true })
	region: string | null;
}

export class OwnerDto {
	@ApiProperty({ example: "Vasil", nullable: true })
	firstName: string | null;

	@ApiProperty({ example: "Kavaleu", nullable: true })
	lastName: string | null;
}

export class PostOutputDto {
	@ApiProperty({ example: "6e8180bd-a89b-479e-a317-ae317dfcc464" })
	id: string;

	@ApiProperty({ example: "Vasil2021" })
	userName: string;

	@ApiProperty({ example: "Nice photo from my trip!" })
	description: string;

	@ApiProperty({ type: LocationDto })
	location: LocationDto;

	@ApiProperty({ type: PostImagesOutputDto })
	images: PostImagesOutputDto;

	@ApiProperty({ example: "2025-08-04T06:54:55.649Z" })
	createdAt: string;

	@ApiProperty({ example: "2025-08-04T06:54:55.649Z" })
	updatedAt: string;

	@ApiProperty({ example: "f1c0df9c-7b60-44b7-9917-d7f7970d751c" })
	ownerId: string;

	@ApiProperty({ example: "folder/avatar.jpg", nullable: true })
	avatarOwner: string | null;

	@ApiProperty({ type: OwnerDto })
	owner: OwnerDto;

	@ApiProperty({ example: 12 })
	likeCount: number;

	@ApiProperty({ example: true })
	isLiked: boolean;

	@ApiProperty({ example: true })
	avatarWhoLikes: boolean;
}

export class PageInfoDto {
	@ApiProperty({ example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38", required: false })
	endCursorPostId?: string;

	@ApiProperty({ example: true })
	hasNextPage: boolean;
}

export class UserPostsOutputDto {
	@ApiProperty({ example: 10 })
	totalCount: number;

	@ApiProperty({ example: 8 })
	pageSize: number;

	@ApiProperty({ type: [PostOutputDto] })
	items: PostOutputDto[];

	@ApiProperty({ type: PageInfoDto })
	pageInfo: PageInfoDto;
}

/*Previos view:

export class UserPostsOutputDto {
	totalCount: number;
	pageSize: number;
	items: {
		id: string; // postId
		userName: string;
		description: string;
		location: {
			city: string | null;
			country: string | null;
			region: string | null;
		};
		images: {
			url: string;
			width: number;
			height: number;
			fileSize: number;
			createdAt: string; // ISO
			uploadId: string;
		}[];
		createdAt: string; // ISO
		updatedAt: string; // ISO
		ownerId: string; // userId
		avatarOwner: string | null; // avatar url ('' если нет)
		owner: {
			firstName: string | null;
			lastName: string | null;
		};
		likeCount: number;
		isLiked: boolean;
		avatarWhoLikes: boolean;
	}[];
	pageInfo: {
		endCursorPostId?: string;
		hasNextPage: boolean;
	};
};   

*/
