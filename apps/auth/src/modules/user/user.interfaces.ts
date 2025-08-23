import { ConfirmCodeDto, BaseUserView } from "@libs/contracts/index";

import { UserWithConfirmationCode, UserWithPassword, UserWithPayloadFromJwt } from "@auth/modules/user/dto/user.dto";
import { UserDbInputDto } from "./dto/user-db-input.dto";
import { ConfirmationCodeInputRepoDto } from "./dto/confirm-input-repo.dto";
import { RecoveryCodeInputRepoDto } from "./dto/recovery-input-repo.dto";
import { NewPasswordInputRepoDto } from "./dto/new-pass-input-repo.dto";
import { MeUserViewDto } from "@libs/contracts/auth-contracts/output/me-user-view.dto";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IUserQueryRepository {
	abstract findUserById(id: string): Promise<BaseUserView | null>;
	abstract getMe(dto: UserWithPayloadFromJwt): Promise<MeUserViewDto>;
	abstract getUsers(): Promise<BaseUserView[]>;
}

export abstract class IUserCommandRepository {
	abstract createUser(userDto: UserDbInputDto): Promise<UserWithConfirmationCode>;
	abstract confirmEmail(dto: ConfirmCodeDto): Promise<boolean>;
	abstract resendEmail(email: string, newConfirmationCodeBody: ConfirmationCodeInputRepoDto): Promise<string | null>;
	abstract passwordRecovery(email: string, recoveryCodeBody: RecoveryCodeInputRepoDto): Promise<string | null>;
	abstract setNewPassword(userId: string, newPasswordBody: NewPasswordInputRepoDto): Promise<boolean>;
	abstract findUserByEmail(email: string): Promise<UserWithPassword | null>;
	abstract findUserByEmailOrUserName(email: string, userName: string): Promise<{ field: string } | null>;
	abstract findUserByRecoveryCode(recoveryCode: string): Promise<UserWithPassword | null>;
}
