// можно заменить на passport.js
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
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
			request["user"] = payload;
			return true;
		} catch (e) {
			console.log(e.message);
			throw new UnauthorizedRpcException();
		}
	}
}
