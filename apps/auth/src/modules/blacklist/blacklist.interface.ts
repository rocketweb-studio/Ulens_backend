import { TokenInputRepoDto } from "@auth/modules/blacklist/dto/token-repo.input.dto";

export abstract class IBlacklistCommandRepository {
	abstract addTokenToBlacklist(token: TokenInputRepoDto): Promise<void>;
	abstract findTokenInBlacklist(token: string): Promise<boolean>;
	abstract deleteExpiredTokens(): Promise<void>;
}
