import { ApiProperty } from "@nestjs/swagger";
import { MessageDBOutputDto, RoomUserOutputDto } from "./message.output.dto";

export class LastMessageOutputDto extends MessageDBOutputDto {}

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
