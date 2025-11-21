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
	abstract getRoomMessageById(messageId: number): Promise<MessageDBOutputDto | null>;
	abstract getRoomUsersById(roomId: number): Promise<{ userId1: string; userId2: string }>;
	abstract getRoomById(roomId: number): Promise<boolean>;
}
