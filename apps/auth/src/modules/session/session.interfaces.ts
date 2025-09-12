import { SessionInputRepoDto } from "@auth/modules/session/dto/session-repo.input.dto";

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
	abstract deleteSession(deviceId: string): Promise<any>;
	abstract updateSession(deviceId: string, payload: any): Promise<void>;
	abstract deleteSessions(userId: string): Promise<any>;
}
