import { Controller, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "@auth/modules/user/user.service";
import { AuthMessages } from "@libs/constants/auth-messages";
import { BaseUserView, ConfirmCodeDto, CreateUserDto, NewPasswordDto, ResendEmailDto, EmailDto, RegistrationGoogleOutputDto } from "@libs/contracts/index";
import { JwtRefreshAuthGuard } from "@auth/core/guards/jwt-refresh-auth.guard";
import { CredentialsAuthGuard } from "@auth/core/guards/credentials-auth.guard";
import { UserWithPayloadFromJwt } from "@auth/modules/user/dto/user.dto";
import { LoginInputDto } from "./dto/login-input.dto";
import { LoginOutputDto, RefreshOutputDto } from "./dto/login-output.dto";
import { RegistrationOutputDto } from "./dto/registration-output.dto";
import { CodeOutputDto } from "./dto/code-output.dto";
import { MeUserViewDto } from "@libs/contracts/auth-contracts/output/me-user-view.dto";
import { IUserQueryRepository } from "./user.interfaces";
import { OauthInputDto } from "./dto/oauth-input.dto";

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

	// таже история что и с emailConfirmation, если оставить просто return падает 500 ошибка
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
	async refreshTokens(@Payload() dto: UserWithPayloadFromJwt): Promise<RefreshOutputDto> {
		const response = await this.userService.refreshTokens(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.LOGOUT })
	async logout(@Payload() dto: UserWithPayloadFromJwt): Promise<any> {
		const response = await this.userService.logout(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.ME })
	async me(@Payload() dto: UserWithPayloadFromJwt): Promise<MeUserViewDto> {
		const response = await this.userQueryRepository.getMe(dto);
		return response;
	}

	@MessagePattern({ cmd: AuthMessages.GET_USERS })
	async getUsers(): Promise<BaseUserView[]> {
		const response = await this.userQueryRepository.getUsers();
		return response;
	}
}
