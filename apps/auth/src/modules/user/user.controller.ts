import { Controller, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "@auth/modules/user/user.service";
import { AuthMessages } from "@libs/constants/auth-messages";
import { ConfirmCodeDto, CreateUserDto, NewPasswordDto, ResendEmailDto } from "@libs/contracts/index";
import { JwtRefreshAuthGuard } from "@auth/core/guards/jwt-refresh-auth.guard";
import { CredentialsAuthGuard } from "@auth/core/guards/credentials-auth.guard";
import { UserWithPayloadFromJwt } from "@auth/modules/user/dto/user.dto";
import { LoginInputDto } from "./dto/login-input.dto";
import { LoginOutputDto } from "./dto/login-output.dto";
import { RegistrationOutputDto } from "./dto/registration-output.dto";
import { CodeOutputDto } from "./dto/code-output.dto";

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern({ cmd: AuthMessages.REGISTRATION })
	async registration(@Payload() createUserDto: CreateUserDto): Promise<RegistrationOutputDto> {
		return this.userService.createUser(createUserDto);
	}

	@MessagePattern({ cmd: AuthMessages.EMAIL_CONFIRMATION })
	async emailConfirmation(@Payload() confirmCodeDto: ConfirmCodeDto): Promise<void> {
		await this.userService.confirmEmail(confirmCodeDto);
		return;
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

	@MessagePattern({ cmd: AuthMessages.NEW_PASSWORD })
	async newPassword(@Payload() newPasswordDto: NewPasswordDto): Promise<void> {
		await this.userService.setNewPassword(newPasswordDto);
		return;
	}

	@UseGuards(CredentialsAuthGuard)
	@MessagePattern({ cmd: AuthMessages.LOGIN })
	async login(@Payload() dto: LoginInputDto): Promise<LoginOutputDto> {
		const response = await this.userService.login(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.REFRESH_TOKENS })
	async refreshTokens(@Payload() dto: UserWithPayloadFromJwt): Promise<{ refreshToken: string; payloadForJwt: any }> {
		const response = await this.userService.refreshTokens(dto);
		return response;
	}

	@UseGuards(JwtRefreshAuthGuard)
	@MessagePattern({ cmd: AuthMessages.LOGOUT })
	async logout(@Payload() dto: UserWithPayloadFromJwt): Promise<any> {
		const response = await this.userService.logout(dto);
		return response;
	}
}
