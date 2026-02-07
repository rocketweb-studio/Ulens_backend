// можно заменить на passport.js
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";
import { RedisService } from "@libs/redis/redis.service";

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedRpcException();
		}

		const [authType, token] = authHeader.split(" ");

		if (authType !== "Bearer") {
			throw new UnauthorizedRpcException();
		}

		try {
			const payload = this.jwtService.verify(token);
			const savedData = await this.redisService.get(`access_token:${payload.deviceId}`);
			if (!savedData) {
				throw new UnauthorizedRpcException("Token not found in redis");
			}
			const parsedSavedData = JSON.parse(savedData as string);
			if (parsedSavedData.accessToken !== token) {
				throw new UnauthorizedRpcException("Token not found in redis");
			}
			request["user"] = payload;
			return true;
		} catch (e) {
			console.log(e.message);
			throw new UnauthorizedRpcException();
		}
	}
}
