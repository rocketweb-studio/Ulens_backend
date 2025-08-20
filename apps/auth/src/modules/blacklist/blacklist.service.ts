import { Injectable } from "@nestjs/common";
import { IBlacklistCommandRepository } from "./blacklist.interface";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { TokenInputRepoDto } from "./dto/token-input-repo.dto";

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
}
