import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { firstValueFrom } from "rxjs";
import { MessengerMessages } from "@libs/constants/index";
import { CreateMessageInputDto, MessageDBOutputDto, MessageOutputDto, RoomDBOutputDto, RoomOutputDto } from "@libs/contracts/index";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";

@Injectable()
export class MessengerClientService {
	constructor(
		@Inject(Microservice.MESSENGER) private readonly client: ClientProxy,
		private readonly profileClientService: ProfileAuthClientService,
		private readonly filesClientService: FilesClientService,
	) {}

	async getRooms(userId: string): Promise<RoomOutputDto[]> {
		const rooms: RoomDBOutputDto[] = await firstValueFrom(this.client.send({ cmd: MessengerMessages.GET_ROOMS }, { userId }));
		const roomUsersIds = rooms.map((room) => room.roomUserId);
		const roomUsers = await this.profileClientService.getProfiles(roomUsersIds);
		const avatars = await this.filesClientService.getAvatarsByUserIds(roomUsersIds);

		return rooms.map((room) => ({
			id: room.id,
			lastMessage: room.lastMessage,
			roomUser: {
				id: room.roomUserId,
				userName: roomUsers.find((user) => user.id === room.roomUserId)?.userName || "",
				firstName: roomUsers.find((user) => user.id === room.roomUserId)?.firstName || null,
				lastName: roomUsers.find((user) => user.id === room.roomUserId)?.lastName || null,
				avatar: avatars.find((avatar) => avatar.userId === room.roomUserId)?.avatars.small?.url || null,
			},
		}));
	}

	async createRoom(userId: string, targetUserId: string): Promise<Omit<RoomOutputDto, "lastMessage" | "roomUser">> {
		const roomId = await firstValueFrom(this.client.send({ cmd: MessengerMessages.CREATE_ROOM }, { currentUserId: userId, targetUserId }));
		return { id: roomId };
	}

	async getRoomMessages(roomId: number, userId: string): Promise<MessageOutputDto[]> {
		const messages: MessageDBOutputDto[] = await firstValueFrom(this.client.send({ cmd: MessengerMessages.GET_ROOM_MESSAGES }, { roomId }));
		const opponentUserId = messages.find((message) => message.authorId !== userId)?.authorId;
		const usersIds = [userId];
		if (opponentUserId) {
			usersIds.push(opponentUserId);
		}
		const users = await this.profileClientService.getProfiles(usersIds);
		const avatars = await this.filesClientService.getAvatarsByUserIds(usersIds);

		return messages.map((message) => ({
			id: message.id,
			content: message.content,
			mediaUrl: message.mediaUrl,
			createdAt: message.createdAt,
			author: {
				id: users.find((user) => user.id === message.authorId)?.id || "",
				userName: users.find((user) => user.id === message.authorId)?.userName || "",
				firstName: users.find((user) => user.id === message.authorId)?.firstName || null,
				lastName: users.find((user) => user.id === message.authorId)?.lastName || null,
				avatar: avatars.find((avatar) => avatar.userId === message.authorId)?.avatars.small?.url || null,
			},
		}));
	}

	async createRoomMessage(roomId: number, userId: string, dto: CreateMessageInputDto): Promise<MessageOutputDto> {
		const message: MessageDBOutputDto = await firstValueFrom(
			this.client.send({ cmd: MessengerMessages.CREATE_ROOM_MESSAGE }, { roomId, userId, payload: dto }),
		);

		const author = await this.profileClientService.getProfile(message.authorId);
		const avatar = await this.filesClientService.getAvatarsByUserIds([author.id]);

		return {
			id: message.id,
			content: message.content,
			mediaUrl: message.mediaUrl,
			createdAt: message.createdAt,
			author: {
				id: message.authorId,
				userName: author.userName,
				firstName: author.firstName,
				lastName: author.lastName,
				avatar: avatar.find((avatar) => avatar.userId === author.id)?.avatars.small?.url || null,
			},
		};
	}

	async getRoomUsersById(roomId: number): Promise<{ userId1: string; userId2: string }> {
		const roomUsers = await firstValueFrom(this.client.send({ cmd: MessengerMessages.GET_ROOM_USERS_BY_ID }, { roomId }));
		return roomUsers;
	}
}
