import { Injectable } from "@nestjs/common";
import { IRoomCommandRepository } from "@messenger/modules/room/room.interface";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { CreateMessageInputDto } from "@libs/contracts/index";

@Injectable()
export class RoomService {
	constructor(private readonly roomCommandRepository: IRoomCommandRepository) {}

	async createRoom(dto: { currentUserId: string; targetUserId: string }): Promise<number> {
		const existingRoom = await this.roomCommandRepository.checkIfRoomExists(dto.currentUserId, dto.targetUserId);
		if (existingRoom) {
			throw new BadRequestRpcException("Room already exists");
		}
		if (dto.currentUserId === dto.targetUserId) {
			throw new BadRequestRpcException("You cannot create a room with yourself");
		}
		return this.roomCommandRepository.createRoom(dto);
	}

	async createRoomMessage(dto: { roomId: number; userId: string; payload: CreateMessageInputDto }): Promise<number> {
		const room = await this.roomCommandRepository.findRoomById(dto.roomId);
		if (!room) {
			throw new NotFoundRpcException("Room not found");
		}
		return this.roomCommandRepository.createRoomMessage(dto);
	}
	// async softDeleteUserNotifications(userId: string): Promise<void> {
	// 	await this.messengerCommandRepository.softDeleteUserNotifications(userId);
	// }

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	// async deleteDeletedNotifications() {
	// 	await this.messengerCommandRepository.deleteDeletedNotifications();
	// }
}
