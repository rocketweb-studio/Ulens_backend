import { Controller, Post, Body, HttpCode, Res, HttpStatus, Req, Get, UseGuards } from "@nestjs/common";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	AccessTokenDto,
	EmailDto,
	RecoveryPasswordDto,
	PayloadFromRequestDto,
	UsersCountOutputDto,
} from "@libs/contracts/index";
import { ApiTags } from "@nestjs/swagger";
import { HttpStatuses, AuthRouterPaths, ApiTagsNames } from "@libs/constants/index";
import { Response, Request } from "express";
import { getSessionMetadata } from "@gateway/utils/session-metadata.util";
import { LoginSwagger } from "@gateway/core/decorators/swagger/auth/login-swagger.decorator";
import { RefreshSwagger } from "@gateway/core/decorators/swagger/auth/refresh-swagger.decorator";
import { LogoutSwagger } from "@gateway/core/decorators/swagger/auth/logout-swagger.decorator";
import { NewPasswordSwagger } from "@gateway/core/decorators/swagger/auth/new-pass-swagger.decorator";
import { PassRecoverySwagger } from "@gateway/core/decorators/swagger/auth/pass-recovery-swagger.decorator";
import { RegistrationEmailResendingSwagger } from "@gateway/core/decorators/swagger/auth/registration-resend-swagger.decorator";
import { RegistrationConfirmationSwagger } from "@gateway/core/decorators/swagger/auth/registration-confirm-swagger.decorator";
import { RegistrationSwagger } from "@gateway/core/decorators/swagger/auth/registration-swagger.decorator";
import { MeSwagger } from "@gateway/core/decorators/swagger/auth/me-swagger.decorator";
import { MeUserViewDto } from "@libs/contracts/index";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { CheckRecoveryCodeSwagger } from "@gateway/core/decorators/swagger/auth/check-recovery-code.decorator";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Environments } from "@gateway/core/core.config";
import { RecaptchaGuard } from "@gateway/core/guards/recaptcha.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { GetUsersCountSwagger } from "@gateway/core/decorators/swagger/auth/get-users-count.decorator";

@ApiTags(ApiTagsNames.AUTH)
@Controller(AuthRouterPaths.AUTH)
export class AuthClientController {
	constructor(private readonly authClientService: AuthClientService) {}

	@UseGuards(ThrottlerGuard)
	@RegistrationSwagger()
	@Post(AuthRouterPaths.REGISTRATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registration(@Body() createUserDto: CreateUserDto): Promise<void> {
		await this.authClientService.registration(createUserDto);
		return;
	}
	@UseGuards(ThrottlerGuard)
	@RegistrationConfirmationSwagger()
	@Post(AuthRouterPaths.REGISTRATION_CONFIRMATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registrationConfirmation(@Body() confirmCodeDto: ConfirmCodeDto): Promise<void> {
		await this.authClientService.emailConfirmation(confirmCodeDto);
		return;
	}

	@UseGuards(ThrottlerGuard)
	@RegistrationEmailResendingSwagger()
	@Post(AuthRouterPaths.REGISTRATION_EMAIL_RESENDING)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registrationEmailResending(@Body() resendEmailDto: ResendEmailDto): Promise<void> {
		await this.authClientService.resendEmail(resendEmailDto);
		return;
	}

	@PassRecoverySwagger()
	@Post(AuthRouterPaths.PASSWORD_RECOVERY)
	@UseGuards(RecaptchaGuard)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async passwordRecovery(@Body() passwordRecoveryDto: RecoveryPasswordDto): Promise<void> {
		await this.authClientService.passwordRecovery(passwordRecoveryDto);
		return;
	}

	@UseGuards(ThrottlerGuard)
	@NewPasswordSwagger()
	@Post(AuthRouterPaths.NEW_PASSWORD)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<void> {
		await this.authClientService.setNewPassword(newPasswordDto);
		return;
	}

	@UseGuards(ThrottlerGuard)
	@CheckRecoveryCodeSwagger()
	@Post(AuthRouterPaths.CHECK_RECOVERY_CODE)
	@HttpCode(HttpStatus.OK)
	async checkRecoveryCode(@Body() checkRecoveryCodeDto: ConfirmCodeDto): Promise<EmailDto> {
		const { email } = await this.authClientService.checkRecoveryCode(checkRecoveryCodeDto);
		return { email };
	}

	@UseGuards(ThrottlerGuard)
	@LoginSwagger()
	@Post(AuthRouterPaths.LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AccessTokenDto> {
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);
		const { accessToken, refreshToken } = await this.authClientService.login(loginDto, metadata);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === Environments.PRODUCTION, // secure только в проде, а для тестов false
			sameSite: "lax",
		});

		return { accessToken };
	}

	@RefreshSwagger()
	@Post(AuthRouterPaths.REFRESH_TOKENS)
	@HttpCode(HttpStatus.OK)
	async refreshTokens(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AccessTokenDto> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		const { accessToken, refreshToken } = await this.authClientService.refreshTokens(refreshTokenFromCookie);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === Environments.PRODUCTION, // secure только в проде, а для тестов false
			sameSite: "lax",
		});
		return { accessToken };
	}

	@LogoutSwagger()
	@Post(AuthRouterPaths.LOGOUT)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		await this.authClientService.logout(refreshTokenFromCookie);
		response.clearCookie("refreshToken");
		return;
	}

	@MeSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get(AuthRouterPaths.ME)
	@HttpCode(HttpStatus.OK)
	async me(@ExtractUserFromRequest() dto: PayloadFromRequestDto): Promise<MeUserViewDto> {
		const userInfo = await this.authClientService.me(dto.userId);
		return userInfo;
	}

	@GetUsersCountSwagger()
	@Get(AuthRouterPaths.USERS_COUNT)
	@HttpCode(HttpStatus.OK)
	async getUsersCount(): Promise<UsersCountOutputDto> {
		return await this.authClientService.getUsersCount();
	}
}
