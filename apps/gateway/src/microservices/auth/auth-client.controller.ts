import { Controller, Post, Body, HttpCode, Res, HttpStatus, Req } from "@nestjs/common";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import { CreateUserDto, ConfirmCodeDto, ResendEmailDto, NewPasswordDto, LoginDto, AccessTokenDto } from "@libs/contracts/index";
import { ApiTags } from "@nestjs/swagger";
import { HttpStatuses, RouterPaths } from "@libs/constants/index";
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

@ApiTags(RouterPaths.AUTH)
@Controller(RouterPaths.AUTH)
export class AuthClientController {
	constructor(private readonly authClientService: AuthClientService) {}

	@RegistrationSwagger()
	@Post(RouterPaths.REGISTRATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registration(@Body() createUserDto: CreateUserDto): Promise<void> {
		await this.authClientService.registration(createUserDto);
		return;
	}

	@RegistrationConfirmationSwagger()
	@Post(RouterPaths.REGISTRATION_CONFIRMATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registrationConfirmation(@Body() confirmCodeDto: ConfirmCodeDto): Promise<void> {
		await this.authClientService.emailConfirmation(confirmCodeDto);
		return;
	}

	@RegistrationEmailResendingSwagger()
	@Post(RouterPaths.REGISTRATION_EMAIL_RESENDING)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async registrationEmailResending(@Body() resendEmailDto: ResendEmailDto): Promise<void> {
		await this.authClientService.resendEmail(resendEmailDto);
		return;
	}

	@PassRecoverySwagger()
	@Post(RouterPaths.PASSWORD_RECOVERY)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async passwordRecovery(@Body() passwordRecoveryDto: ResendEmailDto): Promise<void> {
		await this.authClientService.passwordRecovery(passwordRecoveryDto);
		return;
	}

	@NewPasswordSwagger()
	@Post(RouterPaths.NEW_PASSWORD)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<void> {
		await this.authClientService.setNewPassword(newPasswordDto);
		return;
	}

	@LoginSwagger()
	@Post(RouterPaths.LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AccessTokenDto> {
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);
		const { accessToken, refreshToken } = await this.authClientService.login(loginDto, metadata);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		return { accessToken };
	}

	@RefreshSwagger()
	@Post(RouterPaths.REFRESH_TOKENS)
	@HttpCode(HttpStatus.OK)
	async refreshTokens(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AccessTokenDto> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		const { accessToken, refreshToken } = await this.authClientService.refreshTokens(refreshTokenFromCookie);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		return { accessToken };
	}

	@LogoutSwagger()
	@Post(RouterPaths.LOGOUT)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		await this.authClientService.logout(refreshTokenFromCookie);
		response.clearCookie("refreshToken");
		return;
	}
}
