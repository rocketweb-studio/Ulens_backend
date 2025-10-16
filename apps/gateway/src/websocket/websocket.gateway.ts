import { JwtService } from "@nestjs/jwt";
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WebsocketEvents } from "./websocket.constants";
import { getRoomByUserId } from "./utils/getRoomByUserId.util";
import { NotificationDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";

@WebSocketGateway({ namespace: "/ws", cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly jwtService: JwtService) {}

	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		console.log("✅ WebSocket Gateway initialized");
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

	// так как гварды не работают с socket.io, то мы проверяем токен вручную
	@SubscribeMessage(WebsocketEvents.SUBSCRIBE_NOTIFICATIONS)
	handleNotification(@ConnectedSocket() client: Socket) {
		console.log("[GATEWAY][WS] subscribe-notifications");
		const token = client.handshake.auth.token;
		if (!token) {
			this.forceDisconnect(client, "Missing token");
			return;
		}
		try {
			const payload = this.jwtService.verify(token);
			client.userId = payload.userId;
			// создаем комнату для пользователя
			client.join(getRoomByUserId(payload.userId));
		} catch (e) {
			this.forceDisconnect(client, "Invalid token");
			console.log(e.message);
			return;
		}
	}

	private forceDisconnect(client: Socket, message: string) {
		client.emit(WebsocketEvents.ERROR, message);
		client.disconnect(true);
	}

	sendNotificationToUser(userId: string, dto: NotificationDto) {
		console.log("[GATEWAY][WS] send notification to room ", getRoomByUserId(userId));
		try {
			this.server.to(getRoomByUserId(userId)).emit(WebsocketEvents.NEW_NOTIFICATION, dto);
		} catch (e) {
			throw new Error(e.message);
		}
	}
}
