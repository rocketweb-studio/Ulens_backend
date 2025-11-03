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
import { WsAuthGuard } from "@gateway/core/guards/ws-auth.guard";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({ namespace: "/ws", cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly jwtService: JwtService) {}

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

	sendNotificationToUser(userId: string, dto: NotificationDto) {
		console.log("[GATEWAY][WS] send notification to room ", getRoomByUserId(userId));
		try {
			this.server.to(getRoomByUserId(userId)).emit(WebsocketEvents.NEW_NOTIFICATION, dto);
		} catch (e) {
			throw new Error(e.message);
		}
	}
}
