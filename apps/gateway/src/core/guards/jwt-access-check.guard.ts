import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";

// checking authorized user without throwing an error
@Injectable()
export class JwtAccessCheckGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			request["user"] = undefined;
			return true;
		}

		const [authType, token] = authHeader?.split(" ") ?? [];

		if (authType !== "Bearer" || !token) {
			request["user"] = undefined;
			return true;
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
