import { ApiProperty } from "@nestjs/swagger";

export enum MessageAudioType {
	IMAGE = "IMAGE",
	AUDIO = "AUDIO",
}
export class MessageAudioOutputDto {
	@ApiProperty({
		description: "Audio ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;

	@ApiProperty({
		description: "Message ID",
		example: 1,
	})
	messageId: number | null;

	@ApiProperty({
		description: "Audio URL",
		example: "https://example.com/audio.mp3",
	})
	url: string;
	@ApiProperty({
		description: "Message media type",
		example: MessageAudioType.AUDIO,
		enum: MessageAudioType,
		enumName: "MessageMediaType",
	})
	type: MessageAudioType;
}
