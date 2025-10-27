import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: Socket = context.switchToWs().getClient();
		const token = client.handshake.auth.token;

		try {
			if (!token) {
				console.log("[GATEWAY][WS] WsAuthGuard: Missing token");
				throw new WsException("Missing token");
			}
			const payload = this.jwtService.verify(token);
			client.userId = payload.userId;
		} catch (_error: unknown) {
			console.log("[GATEWAY][WS] WsAuthGuard: Invalid token");
			throw new WsException("Invalid token");
		}
		return true;
	}
}
