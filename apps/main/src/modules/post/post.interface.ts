/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { CreatePostOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { CreatePostWithUserIdDto } from "./dto/create-post.userId.input.dto";
import { PostDbOutputDto } from "./dto/post-db.output";
import { GetUserPostsInputDto } from "./dto/get-user-posts.input.dto";

export abstract class IPostQueryRepository {
	abstract getUserPosts(dto: GetUserPostsInputDto): Promise<any>;
	// abstract findUserById(id: string): Promise<MeUserViewDto | null>;
	// abstract getMe(dto: RefreshTokenDto): Promise<MeUserViewDto>;
	// abstract getUsers(): Promise<MeUserViewDto[]>;
}

export abstract class IPostCommandRepository {
	abstract createPost(dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto>;
	abstract getPostById(id: string): Promise<PostDbOutputDto | null>;
	abstract deletePost(id: string): Promise<boolean>;
	abstract updatePost(dto: UpdatePostDto): Promise<boolean>;
	// abstract createUserAndProfile(userDto: UserDbInputDto): Promise<UserOutputRepoDto>;
	// abstract createOauth2UserAndProfile(dto: UserOauthDbInputDto): Promise<UserOutputRepoDto>;
	// abstract confirmEmail(dto: ConfirmCodeDto): Promise<boolean>;
	// abstract resendEmail(email: string, newConfirmationCodeBody: ConfirmationCodeInputRepoDto): Promise<string | null>;
	// abstract passwordRecovery(email: string, recoveryCodeBody: RecoveryCodeInputRepoDto): Promise<string | null>;
	// abstract setNewPassword(userId: string, newPasswordBody: NewPasswordInputRepoDto): Promise<boolean>;
	// abstract findUserByEmail(email: string): Promise<UserOutputRepoDto | null>;
	// abstract findUserByEmailOrUserName(email: string, userName: string): Promise<{ field: string } | null>;
	// abstract findUserByRecoveryCode(recoveryCode: string): Promise<UserOutputRepoDto | null>;
	// abstract setOauthUserId(email: string, payload: { [key: string]: string }): Promise<boolean>;
	// abstract deleteNotConfirmedUsers(): Promise<void>;
}
