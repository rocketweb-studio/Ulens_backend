import { UUID } from "crypto";
import { SessionInputRepoDto } from "./dto/session-input-repo.dto";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class ISessionQueryRepository {
	// abstract findUserByConfirmationCode(dto: ConfirmCodeDto): Promise<BaseUserView | null>;
	abstract findSessionByTokenData(payload: any): Promise<any | null>;
}

export abstract class ISessionCommandRepository {
	abstract createSession(payload: SessionInputRepoDto): Promise<void>;
	abstract deleteSession(deviceId: UUID): Promise<any>;
	abstract updateSession(deviceId: UUID, payload: any): Promise<void>;
}
