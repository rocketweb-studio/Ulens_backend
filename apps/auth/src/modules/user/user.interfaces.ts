import { ConfirmCodeDto, MeUserViewDto, UserConfirmationOutputDto } from "@libs/contracts/index";
import { UserDbInputDto } from "@auth/modules/user/dto/user-db.input.dto";
import { ConfirmationCodeInputRepoDto } from "@auth/modules/user/dto/confirm-repo.input.dto";
import { RecoveryCodeInputRepoDto } from "@auth/modules/user/dto/recovery-repo.input.dto";
import { NewPasswordInputRepoDto } from "@auth/modules/user/dto/new-pass-repo.input.dto";
import { UserOauthDbInputDto } from "@auth/modules/user/dto/user-google-db.input.dto";
import { UserOutputRepoDto } from "@auth/modules/user/dto/user-repo.ouptut.dto";
import { ProfilePostsDto } from "@libs/contracts/index";
import { PaymentSucceededInput } from "./dto/payment-succeeded.input.dto";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IUserQueryRepository {
	abstract findUserById(id: string): Promise<MeUserViewDto | null>;
	abstract getMe(userId: string): Promise<MeUserViewDto>;
	abstract getUsers(): Promise<MeUserViewDto[]>;
	abstract getProfileForPosts(id: string): Promise<ProfilePostsDto | null>;
	abstract getUserConfirmation(email: string): Promise<UserConfirmationOutputDto>;
}

export abstract class IUserCommandRepository {
	abstract createUserAndProfile(userDto: UserDbInputDto): Promise<UserOutputRepoDto>;
	abstract createOauth2UserAndProfile(dto: UserOauthDbInputDto): Promise<UserOutputRepoDto>;
	abstract confirmEmail(dto: ConfirmCodeDto): Promise<boolean>;
	abstract resendEmail(email: string, newConfirmationCodeBody: ConfirmationCodeInputRepoDto): Promise<string | null>;
	abstract passwordRecovery(email: string, recoveryCodeBody: RecoveryCodeInputRepoDto): Promise<string | null>;
	abstract setNewPassword(userId: string, newPasswordBody: NewPasswordInputRepoDto): Promise<boolean>;
	abstract findUserByEmail(email: string): Promise<UserOutputRepoDto | null>;
	abstract findUserByEmailOrUserName(email: string, userName: string): Promise<{ field: string } | null>;
	abstract findUserByRecoveryCode(recoveryCode: string): Promise<UserOutputRepoDto | null>;
	abstract setOauthUserId(email: string, payload: { [key: string]: string }): Promise<boolean>;
	abstract deleteNotConfirmedUsers(): Promise<void>;
	abstract applyPaymentSucceeded(dto: PaymentSucceededInput): Promise<{ premiumExpDate: string }>;
}
