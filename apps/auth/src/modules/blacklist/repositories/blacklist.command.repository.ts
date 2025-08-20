import { Injectable } from "@nestjs/common";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { IBlacklistCommandRepository } from "../blacklist.interface";
import { TokenInputRepoDto } from "../dto/token-input-repo.dto";

@Injectable()
export class PrismaBlacklistCommandRepository implements IBlacklistCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async addTokenToBlacklist(tokenToBlacklist: TokenInputRepoDto): Promise<void> {
		await this.prisma.tokensBlacklist.create({
			data: tokenToBlacklist,
		});
		return;
	}

	async findTokenInBlacklist(token: string): Promise<boolean> {
		const tokenInBlacklist = await this.prisma.tokensBlacklist.findFirst({
			where: {
				token,
			},
		});
		return !!tokenInBlacklist;
	}
}
