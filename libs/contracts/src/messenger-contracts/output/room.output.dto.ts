import { ApiProperty } from "@nestjs/swagger";
import { MessageDBOutputDto, RoomUserOutputDto } from "./message.output.dto";
import { MessageImgDto } from "@libs/contracts/files-contracts/output/message-img.output.dto";

export class LastMessageOutputDto extends MessageDBOutputDto {
	@ApiProperty({
		description: "Last message media",
		type: [MessageImgDto],
	})
	media: MessageImgDto[] | null;
}

export class RoomOutputDto {
	@ApiProperty({
		description: "Room ID",
		example: 1,
	})
	id: number;

	@ApiProperty({
		description: "Room user with whom the room is created",
		type: RoomUserOutputDto,
	})
	roomUser: RoomUserOutputDto;

	@ApiProperty({
		description: "Room last message",
		type: LastMessageOutputDto,
	})
	lastMessage: LastMessageOutputDto;
}

export class RoomDBOutputDto {
	id: number;
	roomUserId: string;
	lastMessage: MessageDBOutputDto;
}
