import { PrismaService } from "@/src/core/modules/prisma/prisma.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const { req } = ctx.getContext();

		// Check if user is authenticated (has a valid session with userId)
		if (!req.session || !req.session.userId) {
			throw new UnauthorizedException("User not authenticated");
		}

		const user = await this.prismaService.user.findUnique({ where: { id: req.session.userId } });

		if (!user) {
			throw new UnauthorizedException("User not found");
		}

		req.user = user;

		return true;
	}
}
