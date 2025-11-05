import { ConfirmCodeDto, MeUserViewDto, SearchUsersInputDto, UserConfirmationOutputDto, UsersCountOutputDto } from "@libs/contracts/index";
import { UserDbInputDto } from "@auth/modules/user/dto/user-db.input.dto";
import { ConfirmationCodeInputRepoDto } from "@auth/modules/user/dto/confirm-repo.input.dto";
import { RecoveryCodeInputRepoDto } from "@auth/modules/user/dto/recovery-repo.input.dto";
import { NewPasswordInputRepoDto } from "@auth/modules/user/dto/new-pass-repo.input.dto";
import { UserOauthDbInputDto } from "@auth/modules/user/dto/user-google-db.input.dto";
import { UserOutputRepoDto } from "@auth/modules/user/dto/user-repo.ouptut.dto";
import { ProfilePostsDto } from "@libs/contracts/index";
import { PremiumInputDto } from "@auth/modules/user/dto/premium.input.dto";
import { GetUsersQueryGqlDto } from "@auth/modules/user/dto/get-users-query-gql.dto";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IUserQueryRepository {
	abstract findUserById(id: string): Promise<MeUserViewDto | null>;
	abstract getMe(userId: string): Promise<MeUserViewDto>;
	abstract getUsersCount(): Promise<UsersCountOutputDto>;
	abstract getProfileForPosts(id: string): Promise<ProfilePostsDto | null>;
	abstract getUserConfirmation(email: string): Promise<UserConfirmationOutputDto>;
	abstract getUsers(input: GetUsersQueryGqlDto): Promise<any>;
	abstract getUsersBySearch(dto: SearchUsersInputDto): Promise<any>;
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
	abstract findUserById(id: string): Promise<UserOutputRepoDto | null>;
	abstract activatePremiumStatus(dto: PremiumInputDto): Promise<{ premiumExpDate: string; email: string }>;
	abstract deleteUser(userId: string): Promise<boolean>;
	abstract setBlockStatusForUser(userId: string, isBlocked: boolean, reason: string | null): Promise<boolean>;
	abstract findAnyUserByEmail(email: string): Promise<UserOutputRepoDto | null>;
	abstract deleteDeletedUsers(): Promise<void>;
	abstract follow(currentUserId: string, userId: string): Promise<boolean>;
	abstract unfollow(currentUserId: string, userId: string): Promise<boolean>;
}
