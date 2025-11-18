import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { firstValueFrom } from "rxjs";
import { MessengerMessages } from "@libs/constants/index";
import { CreateMessageInputDto, MessageDBOutputDto, MessageOutputDto, RoomDBOutputDto, RoomOutputDto } from "@libs/contracts/index";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Request } from "express";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

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
		const lastMessageMedia = await this.filesClientService.getMediasByMessageIds(rooms.map((room) => room.lastMessage.id));

		return rooms.map((room) => ({
			id: room.id,
			lastMessage: {
				...room.lastMessage,
				media: lastMessageMedia.filter((media) => media.messageId === room.lastMessage.id) || null,
			},
			roomUser: {
				id: room.roomUserId,
				userName: roomUsers.find((user) => user.id === room.roomUserId)?.userName || "",
				firstName: roomUsers.find((user) => user.id === room.roomUserId)?.firstName || null,
				lastName: roomUsers.find((user) => user.id === room.roomUserId)?.lastName || null,
				avatar: avatars.find((avatar) => avatar.userId === room.roomUserId)?.avatars.small?.url || null,
			},
		}));
	}

	async createRoom(userId: string, targetUserId: string): Promise<Omit<RoomOutputDto, "lastMessage" | "roomUser" | "media">> {
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
		const media = await this.filesClientService.getMediasByMessageIds(messages.map((message) => message.id));

		return messages.map((message) => ({
			id: message.id,
			content: message.content,
			createdAt: message.createdAt,
			media: media.filter((media) => media.messageId === message.id) || null,
			author: {
				id: users.find((user) => user.id === message.authorId)?.id || "",
				userName: users.find((user) => user.id === message.authorId)?.userName || "",
				firstName: users.find((user) => user.id === message.authorId)?.firstName || null,
				lastName: users.find((user) => user.id === message.authorId)?.lastName || null,
				avatar: avatars.find((avatar) => avatar.userId === message.authorId)?.avatars.small?.url || null,
			},
		}));
	}

	async createRoomMessage(roomId: number, userId: string, dto: CreateMessageInputDto): Promise<Omit<MessageOutputDto, "media">> {
		const message: MessageDBOutputDto = await firstValueFrom(
			this.client.send({ cmd: MessengerMessages.CREATE_ROOM_MESSAGE }, { roomId, userId, payload: dto }),
		);

		const author = await this.profileClientService.getProfile(message.authorId);
		const avatar = await this.filesClientService.getAvatarsByUserIds([author.id]);

		return {
			id: message.id,
			content: message.content,
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

	async uploadMessageImages(roomId: number, req: Request): Promise<any> {
		const isRoomExists = await this.getRoomById(roomId);
		if (!isRoomExists) {
			throw new NotFoundRpcException("Room not found");
		}
		const result = await this.filesClientService.uploadMessageImages(roomId, req);
		return result;
		// const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.POST_IMAGES);

		// if (!uploadResult.success) {
		// 	throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Images upload failed");
		// }

		// // Сохраняем информацию о всех изображениях в БД // todo ===========start=========== сделать это в микросервисе
		// const dbResults = await Promise.all(uploadResult.files.map((file) => this.filesClientService.savePostImagesToDB(postId, file)));
		// // todo ===========end===========
		// // const post = await this.getPost(postId);
		// return dbResults[dbResults.length - 1];
	}

	private async getRoomById(roomId: number): Promise<boolean> {
		const isRoomExists: boolean = await firstValueFrom(this.client.send({ cmd: MessengerMessages.GET_ROOM_BY_ID }, { roomId }));
		return isRoomExists;
	}
}
