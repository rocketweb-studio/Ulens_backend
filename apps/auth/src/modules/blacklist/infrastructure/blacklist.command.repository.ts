import { Injectable } from "@nestjs/common";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { IBlacklistCommandRepository } from "@auth/modules/blacklist/blacklist.interface";
import { TokenInputRepoDto } from "@auth/modules/blacklist/dto/token-repo.input.dto";

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

	async deleteExpiredTokens() {
		const { count } = await this.prisma.tokensBlacklist.deleteMany({
			where: {
				expiredAt: { lt: new Date() },
			},
		});
		console.log(`Deleted expired tokens: [${count}]`);
	}
}
