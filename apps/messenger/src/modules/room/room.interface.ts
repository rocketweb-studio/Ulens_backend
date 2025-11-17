import { CreateMessageInputDto, MessageDBOutputDto, RoomDBOutputDto } from "@libs/contracts/index";

export abstract class IRoomCommandRepository {
	abstract createRoom(dto: { currentUserId: string; targetUserId: string }): Promise<number>;
	abstract checkIfRoomExists(currentUserId: string, targetUserId: string): Promise<boolean>;
	abstract findRoomById(roomId: number): Promise<any>;
	abstract createRoomMessage(dto: { roomId: number; userId: string; payload: CreateMessageInputDto }): Promise<any>;
}

export abstract class IRoomQueryRepository {
	abstract getRoomsByUserId(userId: string): Promise<RoomDBOutputDto[]>;
	abstract getRoomMessagesByRoomId(roomId: number): Promise<MessageDBOutputDto[]>;
}
