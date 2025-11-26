import { MessageImgDto } from "@libs/contracts/files-contracts/output/message-img.output.dto";
import { MessageAudioOutputDto } from "@libs/contracts/files-contracts/output/messsage-audio.output.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RoomUserOutputDto {
	@ApiProperty({
		description: "User ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;
	@ApiProperty({
		description: "User name",
		example: "JohnDoe",
	})
	userName: string;
	@ApiProperty({
		description: "User first name",
		example: "John",
	})
	firstName: string | null;
	@ApiProperty({
		description: "User last name",
		example: "Doe",
	})
	lastName: string | null;
	@ApiProperty({
		description: "User avatar",
		example: "https://example.com/avatar.jpg",
	})
	avatar: string | null;
}

export class MessageOutputDto {
	@ApiProperty({
		description: "Message ID",
		example: 1,
	})
	id: number;

	@ApiProperty({
		description: "Message content",
		example: "Hello, how are you?",
	})
	content: string;

	@ApiProperty({
		description: "Message created at",
		example: "2021-01-01T00:00:00.000Z",
	})
	createdAt: Date;

	@ApiProperty({
		description: "Message author",
		type: RoomUserOutputDto,
	})
	author: RoomUserOutputDto;
}
export enum MessageMediaType {
	IMAGE = "IMAGE",
	AUDIO = "AUDIO",
}
export class MessageMediaImageOutputDto {
	@ApiProperty({
		description: "Message image",
		type: [MessageImgDto],
	})
	media: MessageImgDto[] | null;
}

export class MessageMediaAudioOutputDto {
	@ApiProperty({
		description: "Message audio",
		type: MessageAudioOutputDto,
	})
	media: MessageAudioOutputDto | null;
}

export class MessageDBOutputDto {
	@ApiProperty({ description: "Message ID", example: 1 })
	id: number;
	@ApiProperty({ description: "Message content", example: "Hello, how are you?" })
	content: string;
	@ApiProperty({ description: "Message created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
	@ApiProperty({ description: "Message author ID", example: "123e4567-e89b-12d3-a456-426614174000" })
	authorId: string;
}
