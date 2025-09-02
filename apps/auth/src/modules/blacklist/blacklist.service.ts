import { Injectable } from "@nestjs/common";
import { IBlacklistCommandRepository } from "@auth/modules/blacklist/blacklist.interface";
import { JwtPayloadDto } from "@auth/modules/blacklist/dto/jwt-payload.dto";
import { TokenInputRepoDto } from "@auth/modules/blacklist/dto/token-repo.input.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class BlacklistService {
	constructor(private readonly blacklistCommandRepository: IBlacklistCommandRepository) {}

	async addTokenToBlacklist(token: string, payloadFromJwt: JwtPayloadDto): Promise<void> {
		const expiredAt = new Date(payloadFromJwt.exp * 1000);

		const tokenToBlacklist: TokenInputRepoDto = {
			token,
			expiredAt,
		};
		await this.blacklistCommandRepository.addTokenToBlacklist(tokenToBlacklist);
	}

	async findTokenInBlacklist(token: string): Promise<boolean> {
		return await this.blacklistCommandRepository.findTokenInBlacklist(token);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteExpiredTokens() {
		await this.blacklistCommandRepository.deleteExpiredTokens();
	}
}
