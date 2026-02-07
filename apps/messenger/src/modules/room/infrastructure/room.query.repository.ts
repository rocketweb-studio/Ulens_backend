import { IRoomQueryRepository } from "@messenger/modules/room/room.interface";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@messenger/core/prisma/prisma.service";
import { MessageDBOutputDto, RoomDBOutputDto } from "@libs/contracts/index";
import { Message, Room } from "@messenger/core/prisma/generated";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

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
		console.log("rooms", rooms);
		return rooms.map((room) => this._mapToOutput(room, userId));
	}

	async getRoomMessagesByRoomId(roomId: number): Promise<MessageDBOutputDto[]> {
		const messages = await this.prisma.message.findMany({
			where: { roomId },
			orderBy: { createdAt: "desc" },
		});
		return messages.map((message) => this._mapMessageToOutput(message));
	}

	async getRoomMessageById(messageId: number): Promise<MessageDBOutputDto | null> {
		const message = await this.prisma.message.findUnique({
			where: { id: messageId },
		});
		return message ? this._mapMessageToOutput(message) : null;
	}

	async getRoomUsersById(roomId: number): Promise<{ userId1: string; userId2: string }> {
		const room = await this.prisma.room.findUnique({
			where: { id: roomId },
		});
		if (!room) {
			throw new NotFoundRpcException("Room not found");
		}
		return { userId1: room.userId1, userId2: room.userId2 };
	}

	async getRoomById(roomId: number): Promise<boolean> {
		const room = await this.prisma.room.findUnique({
			where: { id: roomId },
		});
		return !!room;
	}

	private _mapToOutput(room: Room & { messages: Message[] }, userId: string): RoomDBOutputDto {
		return {
			id: room.id,
			roomUserId: [room.userId1, room.userId2].find((id) => id !== userId) as string,
			lastMessage: room.messages[0] ? this._mapMessageToOutput(room.messages[0]) : null,
		};
	}

	private _mapMessageToOutput(message: Message): MessageDBOutputDto {
		return {
			id: message.id,
			content: message.content,
			createdAt: message.createdAt,
			authorId: message.userId,
		};
	}
}
