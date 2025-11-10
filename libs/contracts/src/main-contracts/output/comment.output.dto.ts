import { ApiProperty } from "@nestjs/swagger";

export class CommentatorOutputDto {
	@ApiProperty({ example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38" })
	id: string;
	@ApiProperty({ example: "Vasil2021" })
	username: string;
	@ApiProperty({ example: "folder/avatar.jpg" })
	avatar: string | null;
}

export class CommentOutputDto {
	@ApiProperty({ example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38" })
	id: string;
	@ApiProperty({ example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38" })
	postId: string;
	@ApiProperty({ example: "This is a comment" })
	content: string;
	@ApiProperty({ example: "2025-08-04T06:54:55.649Z" })
	createdAt: Date;
	@ApiProperty({ type: CommentatorOutputDto })
	commentator: CommentatorOutputDto;
}
