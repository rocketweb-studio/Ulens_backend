import { Controller, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "@auth/modules/user/user.service";
import { AuthMessages } from "@libs/constants/auth-messages";
import {
	ConfirmCodeDto,
	CreateUserDto,
	NewPasswordDto,
	ResendEmailDto,
	EmailDto,
	RegistrationGoogleOutputDto,
	MeUserViewDto,
	UserConfirmationOutputDto,
	UsersCountOutputDto,
} from "@libs/contracts/index";
import { JwtRefreshAuthGuard } from "@auth/core/guards/jwt-refresh-auth.guard";
import { CredentialsAuthGuard } from "@auth/core/guards/credentials-auth.guard";
import { LoginInputDto } from "@auth/modules/user/dto/login.input.dto";
import { LoginOutputDto, RefreshOutputDto } from "@auth/modules/user/dto/login.output.dto";
import { RegistrationOutputDto } from "@auth/modules/user/dto/registration.output.dto";
import { CodeOutputDto } from "@auth/modules/user/dto/code.output.dto";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { OauthInputDto } from "@auth/modules/user/dto/oauth.input.dto";
import { RefreshDecodedDto } from "@auth/modules/user/dto/refresh-decoded.dto";
import { ProfilePostsDto } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { GetUsersQueryGqlDto } from "@auth/modules/user/dto/get-users-query-gql.dto";
import { GetUsersOutputDto } from "@auth/modules/user/dto/get-users.ouptut.dto";

@Controller()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly userQueryRepository: IUserQueryRepository,
	) {}

	@MessagePattern({ cmd: AuthMessages.REGISTRATION })
	async registration(@Payload() createUserDto: CreateUserDto): Promise<RegistrationOutputDto> {
		return this.userService.createUser(createUserDto);
	}

	@MessagePattern({ cmd: AuthMessages.REGISTRATION_OAUTH2 })
	async registrationOauth2(@Payload() dto: OauthInputDto): Promise<RegistrationGoogleOutputDto> {
		const { registerDto, metadata, provider } = dto;
		return this.userService.registrationOauth2(registerDto, metadata, provider);
	}

	/**
	 *В @MessagePattern всегда нужно вернуть какое-то значение, иначе клиент через send() получит
	 *	 «пустую последовательность» и выбросит ошибку.
	 */
	@MessagePattern({ cmd: AuthMessages.EMAIL_CONFIRMATION })
	async emailConfirmation(@Payload() confirmCodeDto: ConfirmCodeDto): Promise<boolean> {
		await this.userService.confirmEmail(confirmCodeDto);
		return true;
	}

	@MessagePattern({ cmd: AuthMessages.RESEND_EMAIL })
	async registrationEmailResending(@Payload() resendEmailDto: ResendEmailDto): Promise<CodeOutputDto> {
		return this.userService.resendEmail(resendEmailDto);
	}

	@MessagePattern({ cmd: AuthMessages.PASSWORD_RECOVERY })
	async passwordRecovery(@Payload() passwordRecoveryDto: ResendEmailDto): Promise<CodeOutputDto> {
		const response = await this.userService.passwordRecovery(passwordRecoveryDto);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.CHECK_RECOVERY_CODE })
	async checkRecoveryCode(@Payload() checkRecoveryCodeDto: ConfirmCodeDto): Promise<EmailDto> {
		const response = await this.userService.checkRecoveryCode(checkRecoveryCodeDto);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.NEW_PASSWORD })
	async newPassword(@Payload() newPasswordDto: NewPasswordDto): Promise<boolean> {
		await this.userService.setNewPassword(newPasswordDto);
		return true;
	}

	@UseGuards(CredentialsAuthGuard)
	@MessagePattern({ cmd: AuthMessages.LOGIN })
	async login(@Payload() dto: LoginInputDto): Promise<LoginOutputDto> {
		const response = await this.userService.login(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.REFRESH_TOKENS })
	async refreshTokens(@Payload() dto: RefreshDecodedDto): Promise<RefreshOutputDto> {
		const response = await this.userService.refreshTokens(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.LOGOUT })
	async logout(@Payload() dto: RefreshDecodedDto): Promise<any> {
		const response = await this.userService.logout(dto);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.ME })
	async me(@Payload() dto: { userId: string }): Promise<MeUserViewDto> {
		const response = await this.userQueryRepository.getMe(dto.userId);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.GET_USERS_COUNT })
	async getUsersCount(): Promise<UsersCountOutputDto> {
		return await this.userQueryRepository.getUsersCount();
	}

	@MessagePattern({ cmd: AuthMessages.GET_PROFILE_FOR_POSTS })
	async getProfileForPosts(id: string): Promise<ProfilePostsDto | null> {
		const response = await this.userQueryRepository.getProfileForPosts(id);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.GET_USER_CONFIRMATION_BY_EMAIL })
	async getUserConfirmation(@Payload() { email }: { email: string }): Promise<UserConfirmationOutputDto> {
		const response = await this.userQueryRepository.getUserConfirmation(email);
		return response;
	}

	// GRAPHQL
	@MessagePattern({ cmd: AuthMessages.ADMIN_GET_USERS })
	async getUsers(@Payload() input: GetUsersQueryGqlDto): Promise<GetUsersOutputDto> {
		const response = await this.userQueryRepository.getUsers(input);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.ADMIN_DELETE_USER })
	async deleteUser(@Payload() payload: { userId: string }): Promise<boolean> {
		const user = await this.userQueryRepository.findUserById(payload.userId);
		if (!user) {
			throw new NotFoundRpcException("User not found");
		}
		return await this.userService.deleteUser(payload.userId);
	}

	@MessagePattern({ cmd: AuthMessages.ADMIN_SET_BLOCK_STATUS_FOR_USER })
	async setBlockStatusForUser(@Payload() payload: { userId: string; isBlocked: boolean; reason: string | null }): Promise<boolean> {
		const user = await this.userQueryRepository.findUserById(payload.userId);
		if (!user) {
			throw new NotFoundRpcException("User not found");
		}
		return await this.userService.setBlockStatusForUser(payload.userId, payload.isBlocked, payload.reason);
	}
}
