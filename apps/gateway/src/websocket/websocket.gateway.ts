import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WebsocketEvents } from "./websocket.constants";
import { getAllRoomMessagesByUserId, getChatByRoomId, getRoomByUserId } from "./utils/getRoomByUserId.util";
import { NotificationDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { WsAuthGuard } from "@gateway/core/guards/ws-auth.guard";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessengerClientService } from "@gateway/microservices/messenger/messenger-client.service";
import { MessageAudioOutputDto, MessageImgDto, MessageMediaAudioOutputDto, MessageMediaImageOutputDto, MessageOutputDto } from "@libs/contracts/index";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";

@WebSocketGateway({ namespace: "/ws", cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly jwtService: JwtService,
		private readonly messengerClientService: MessengerClientService,
		private readonly filesClientService: FilesClientService,
	) {}

	@WebSocketServer() server: Server;

	afterInit(_server: Server) {
		this.server.use((socket, next) => {
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error("Missing token"));
			}
			try {
				const payload = this.jwtService.verify(token);
				socket.userId = payload.userId;
				console.log("✅ WebSocket Gateway initialized");
				next();
			} catch {
				next(new Error("Invalid token"));
			}
		});
		setInterval(() => {
			this.server.emit(WebsocketEvents.TEST_NOTIFICATION, {
				message: "Hello, world!",
			});
		}, 60_000);
	}

	handleConnection(client: Socket) {
		console.log(`WebSocket Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		if (client.userId) {
			console.log(`👤 Disconnected user: ${client.userId}`);
		}
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(WebsocketEvents.SUBSCRIBE_NOTIFICATIONS)
	handleNotification(@ConnectedSocket() client: Socket) {
		console.log("[GATEWAY][WS] subscribe-notifications");
		if (client.userId) {
			client.join(getRoomByUserId(client.userId));
		}
	}

	sendNotificationToUser(userId: string, dto: NotificationDto & { metadata: any | null }) {
		console.log("[GATEWAY][WS] send notification to room ", getRoomByUserId(userId));
		try {
			this.server.to(getRoomByUserId(userId)).emit(WebsocketEvents.NEW_NOTIFICATION, dto);
		} catch (e) {
			throw new Error(e.message);
		}
	}

	// todo чат сделан напрямую через TCP, по хорошему использовать RabbitMQ для общения с микросервисами
	@UseGuards(WsAuthGuard)
	@SubscribeMessage(WebsocketEvents.SUBSCRIBE_CHAT)
	handleChatSubscribe(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomId: number }) {
		console.log(`[WS] User ${client.userId} subscribed to chat ${payload.roomId}`);
		client.join(getChatByRoomId(payload.roomId));
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(WebsocketEvents.SEND_MESSAGE)
	async handleMessageFromRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: { roomId: number; content: string; media?: MessageImgDto[] | MessageAudioOutputDto | null },
	) {
		console.log(`[WS] User ${client.userId} sent message to room ${payload.roomId}: ${payload.content}`);
		// @ts-expect-error
		const message: MessageOutputDto = await this.messengerClientService.createRoomMessage(payload.roomId, client.userId, { content: payload.content });
		if (!payload.media) {
			await this.sendMessageToRoom(payload.roomId, { ...message, media: null });
			return;
		}

		if (payload.media) {
			if (Array.isArray(payload.media)) {
				await this.filesClientService.updateMessageImages(
					message.id,
					payload.media.map((image) => image.id),
				);
				await this.sendMessageToRoom(payload.roomId, { ...message, media: [{ media: payload.media }] });
			} else {
				await this.filesClientService.updateMessageAudio(message.id, payload.media.id);
				await this.sendMessageToRoom(payload.roomId, { ...message, media: { media: payload.media } });
			}
		}
	}

	async sendMessageToRoom(roomId: number, message: (MessageOutputDto & { media: MessageMediaImageOutputDto[] | MessageMediaAudioOutputDto | null }) | null) {
		this.server.to(getChatByRoomId(roomId)).emit(WebsocketEvents.NEW_MESSAGE, message);
		const roomUsers = await this.messengerClientService.getRoomUsersById(roomId);

		[roomUsers.userId1, roomUsers.userId2].forEach((userId) => {
			this.server.to(getAllRoomMessagesByUserId(userId)).emit(WebsocketEvents.NEW_GLOBAL_MESSAGE, { ...message, roomId });
		});
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(WebsocketEvents.SUBSCRIBE_ALL_ROOM_MESSAGES)
	handleAllRoomMessagesSubscribe(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
		console.log(`[WS] User ${client.userId} subscribed to all room messages`);
		client.join(getAllRoomMessagesByUserId(payload.userId));
	}
}
