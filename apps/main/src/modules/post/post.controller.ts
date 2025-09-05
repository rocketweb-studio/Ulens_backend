import { Controller } from "@nestjs/common";
import { PostService } from "./post.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MainMessages } from "@libs/constants/index";
import { CreatePostWithUserIdDto } from "./dto/create-post.userId.input.dto";
import { CreatePostOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "./dto/delete-post.input.dto";
import { GetUserPostsInputDto } from "./dto/get-user-posts.input.dto";
import { IPostQueryRepository } from "./post.interface";

@Controller()
export class PostController {
	constructor(
		// private readonly userService: UserService,
		// private readonly userQueryRepository: IUserQueryRepository,
		private readonly postService: PostService,
		private readonly postQueryRepository: IPostQueryRepository,
	) {}

	@MessagePattern({ cmd: MainMessages.CREATE_POST })
	async createPost(@Payload() dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto> {
		return this.postService.createPost(dto);
	}

	@MessagePattern({ cmd: MainMessages.DELETE_POST })
	async deletePost(@Payload() dto: DeletePostDto): Promise<boolean> {
		return this.postService.deletePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.UPDATE_POST })
	async updatePost(@Payload() dto: UpdatePostDto): Promise<boolean> {
		return this.postService.updatePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS })
	async getUserPosts(@Payload() dto: GetUserPostsInputDto): Promise<any> {
		return this.postQueryRepository.getUserPosts(dto);
	}

	// @MessagePattern({ cmd: AuthMessages.REGISTRATION })
	// async registration(@Payload() createUserDto: CreateUserDto): Promise<RegistrationOutputDto> {
	// 	return this.userService.createUser(createUserDto);
	// }

	// @MessagePattern({ cmd: AuthMessages.REGISTRATION_OAUTH2 })
	// async registrationOauth2(@Payload() dto: OauthInputDto): Promise<RegistrationGoogleOutputDto> {
	// 	const { registerDto, metadata, provider } = dto;
	// 	return this.userService.registrationOauth2(registerDto, metadata, provider);
	// }

	// /**
	//  *В @MessagePattern всегда нужно вернуть какое-то значение, иначе клиент через send() получит
	//  *	 «пустую последовательность» и выбросит ошибку.
	//  */
	// @MessagePattern({ cmd: AuthMessages.EMAIL_CONFIRMATION })
	// async emailConfirmation(@Payload() confirmCodeDto: ConfirmCodeDto): Promise<boolean> {
	// 	await this.userService.confirmEmail(confirmCodeDto);
	// 	return true;
	// }

	// @MessagePattern({ cmd: AuthMessages.RESEND_EMAIL })
	// async registrationEmailResending(@Payload() resendEmailDto: ResendEmailDto): Promise<CodeOutputDto> {
	// 	return this.userService.resendEmail(resendEmailDto);
	// }

	// @MessagePattern({ cmd: AuthMessages.PASSWORD_RECOVERY })
	// async passwordRecovery(@Payload() passwordRecoveryDto: ResendEmailDto): Promise<CodeOutputDto> {
	// 	const response = await this.userService.passwordRecovery(passwordRecoveryDto);
	// 	return response;
	// }

	// @MessagePattern({ cmd: AuthMessages.CHECK_RECOVERY_CODE })
	// async checkRecoveryCode(@Payload() checkRecoveryCodeDto: ConfirmCodeDto): Promise<EmailDto> {
	// 	const response = await this.userService.checkRecoveryCode(checkRecoveryCodeDto);
	// 	return response;
	// }

	// @MessagePattern({ cmd: AuthMessages.NEW_PASSWORD })
	// async newPassword(@Payload() newPasswordDto: NewPasswordDto): Promise<boolean> {
	// 	await this.userService.setNewPassword(newPasswordDto);
	// 	return true;
	// }

	// @UseGuards(CredentialsAuthGuard)
	// @MessagePattern({ cmd: AuthMessages.LOGIN })
	// async login(@Payload() dto: LoginInputDto): Promise<LoginOutputDto> {
	// 	const response = await this.userService.login(dto);
	// 	return response;
	// }

	// @UseGuards(JwtRefreshAuthGuard)
	// @MessagePattern({ cmd: AuthMessages.REFRESH_TOKENS })
	// async refreshTokens(@Payload() dto: RefreshDecodedDto): Promise<RefreshOutputDto> {
	// 	const response = await this.userService.refreshTokens(dto);
	// 	return response;
	// }

	// @UseGuards(JwtRefreshAuthGuard)
	// @MessagePattern({ cmd: AuthMessages.LOGOUT })
	// async logout(@Payload() dto: RefreshDecodedDto): Promise<any> {
	// 	const response = await this.userService.logout(dto);
	// 	return response;
	// }

	// @UseGuards(JwtRefreshAuthGuard)
	// @MessagePattern({ cmd: AuthMessages.ME })
	// async me(@Payload() dto: RefreshDecodedDto): Promise<MeUserViewDto> {
	// 	const response = await this.userQueryRepository.getMe(dto);
	// 	return response;
	// }

	// @MessagePattern({ cmd: AuthMessages.GET_USERS })
	// async getUsers(): Promise<MeUserViewDto[]> {
	// 	const response = await this.userQueryRepository.getUsers();
	// 	return response;
	// }
}
