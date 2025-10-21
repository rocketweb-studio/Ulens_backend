import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CoreEnvConfig } from "../core.config";

@Injectable()
export class GqlBasicAuthGuard implements CanActivate {
	constructor(private readonly coreConfig: CoreEnvConfig) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const { req } = ctx.getContext();

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Basic ")) {
			throw new UnauthorizedException("Missing or invalid Authorization header");
		}

		const base64Credentials = authHeader.split(" ")[1];
		const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
		const [email, password] = credentials.split(":");

		if (email !== this.coreConfig.adminEmail || password !== this.coreConfig.adminPassword) {
			throw new UnauthorizedException("Invalid credentials");
		}

		return true;
	}
}
