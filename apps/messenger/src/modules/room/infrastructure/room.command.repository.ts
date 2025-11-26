import { PrismaService } from "@messenger/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IRoomCommandRepository } from "@messenger/modules/room/room.interface";
import { CreateMessageInputDto } from "@libs/contracts/index";

@Injectable()
export class RoomCommandRepository implements IRoomCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createRoom(dto: { currentUserId: string; targetUserId: string }): Promise<number> {
		const room = await this.prisma.room.create({
			data: { userId1: dto.currentUserId, userId2: dto.targetUserId },
		});
		return room.id;
	}

	async checkIfRoomExists(currentUserId: string, targetUserId: string): Promise<boolean> {
		const room = await this.prisma.room.findFirst({
			where: {
				OR: [
					{ userId1: currentUserId, userId2: targetUserId },
					{ userId1: targetUserId, userId2: currentUserId },
				],
			},
		});
		return !!room;
	}

	async findRoomById(roomId: number): Promise<any> {
		const room = await this.prisma.room.findUnique({
			where: { id: roomId },
		});
		return room;
	}

	async createRoomMessage(dto: { roomId: number; userId: string; payload: CreateMessageInputDto }): Promise<number> {
		const message = await this.prisma.message.create({
			data: { roomId: dto.roomId, userId: dto.userId, content: dto.payload.content },
		});
		return message.id;
	}
	// async softDeleteUserNotifications(userId: string): Promise<void> {
	// 	await this.prisma.message.updateMany({
	// 		where: { userId },
	// 		data: { deletedAt: new Date() },
	// 	});
	// }

	// async deleteDeletedNotifications(): Promise<void> {
	// 	const { count } = await this.prisma.message.deleteMany({
	// 		where: { deletedAt: { not: null } },
	// 	});
	// 	console.log(`Deleted deleted notifications: [${count}]`);
	// }
}
