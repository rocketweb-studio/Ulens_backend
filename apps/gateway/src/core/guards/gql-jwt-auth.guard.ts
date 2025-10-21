import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const { req } = ctx.getContext();

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedException("Missing or invalid Authorization header");
		}

		const token = authHeader.split(" ")[1];

		try {
			this.jwtService.verify(token);
			return true;
		} catch (e) {
			console.log(e.message);
			throw new UnauthorizedRpcException();
		}
	}
}
