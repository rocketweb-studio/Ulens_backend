import { IRoomQueryRepository } from "@messenger/modules/room/room.interface";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@messenger/core/prisma/prisma.service";
import { MessageDBOutputDto, RoomDBOutputDto } from "@libs/contracts/index";
import { Message, Room } from "@messenger/core/prisma/generated";

@Injectable()
export class RoomQueryRepository implements IRoomQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getRoomsByUserId(userId: string): Promise<RoomDBOutputDto[]> {
		const rooms = await this.prisma.room.findMany({
			where: {
				OR: [{ userId1: userId }, { userId2: userId }],
				deletedAt: null,
			},
			include: {
				messages: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		});

		return rooms.map((room) => this._mapToOutput(room, userId));
	}

	async getRoomMessagesByRoomId(roomId: number): Promise<MessageDBOutputDto[]> {
		const messages = await this.prisma.message.findMany({
			where: { roomId },
			orderBy: { createdAt: "desc" },
		});
		return messages.map((message) => this._mapMessageToOutput(message));
	}

	private _mapToOutput(room: Room & { messages: Message[] }, userId: string): RoomDBOutputDto {
		return {
			id: room.id,
			roomUserId: [room.userId1, room.userId2].find((id) => id !== userId) as string,
			lastMessage: this._mapMessageToOutput(room.messages[0]),
		};
	}

	private _mapMessageToOutput(message: Message): MessageDBOutputDto {
		return {
			id: message.id,
			content: message.content,
			mediaUrl: message.mediaUrl,
			createdAt: message.createdAt,
			authorId: message.userId,
		};
	}
}
