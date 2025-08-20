import { TokenInputRepoDto } from "./dto/token-input-repo.dto";

export abstract class IBlacklistCommandRepository {
	abstract addTokenToBlacklist(token: TokenInputRepoDto): Promise<void>;
	abstract findTokenInBlacklist(token: string): Promise<boolean>;
}
