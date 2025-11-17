import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IRoomQueryRepository } from "@messenger/modules/room/room.interface";
import { RoomService } from "@messenger/modules/room/room.service";
import { MessengerMessages } from "@libs/constants/index";
import { CreateMessageInputDto, MessageDBOutputDto } from "@libs/contracts/index";

@Controller()
export class RoomController {
	constructor(
		private readonly roomQueryRepository: IRoomQueryRepository,
		private readonly roomService: RoomService,
	) {}

	@MessagePattern({ cmd: MessengerMessages.GET_ROOMS })
	async getRooms(@Payload() dto: { userId: string }): Promise<any> {
		const rooms = await this.roomQueryRepository.getRoomsByUserId(dto.userId);
		return rooms;
	}

	@MessagePattern({ cmd: MessengerMessages.CREATE_ROOM })
	async createRoom(@Payload() dto: { currentUserId: string; targetUserId: string }): Promise<number> {
		const room = await this.roomService.createRoom(dto);
		return room;
	}

	@MessagePattern({ cmd: MessengerMessages.CREATE_ROOM_MESSAGE })
	async createRoomMessage(@Payload() dto: { roomId: number; userId: string; payload: CreateMessageInputDto }): Promise<number> {
		const messageId = await this.roomService.createRoomMessage(dto);
		return messageId;
	}

	@MessagePattern({ cmd: MessengerMessages.GET_ROOM_MESSAGES })
	async getRoomMessages(@Payload() dto: { roomId: number }): Promise<MessageDBOutputDto[]> {
		const messages = await this.roomQueryRepository.getRoomMessagesByRoomId(dto.roomId);
		return messages;
	}
}
