import { SessionInputRepoDto } from "@auth/modules/session/dto/session-repo.input.dto";
import { PayloadFromRequestDto, SessionOutputDto } from "@libs/contracts/index";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class ISessionQueryRepository {
	// abstract findUserByConfirmationCode(dto: ConfirmCodeDto): Promise<BaseUserView | null>;
	abstract findSessionByTokenData(payload: any): Promise<any | null>;
	abstract getSessions(user: PayloadFromRequestDto): Promise<SessionOutputDto>;
}

export abstract class ISessionCommandRepository {
	abstract findSessionByDeviceId(deviceId: string): Promise<string | null>;
	abstract createSession(payload: SessionInputRepoDto): Promise<void>;
	abstract deleteSession(deviceId: string): Promise<boolean>;
	abstract updateSession(deviceId: string, payload: any): Promise<void>;
	abstract deleteOtherSessions(userId: string, deviceId: string): Promise<boolean>;
	abstract deleteAllSessions(userId: string): Promise<boolean>;
	abstract deleteExpiredSessions(): Promise<boolean>;
}
