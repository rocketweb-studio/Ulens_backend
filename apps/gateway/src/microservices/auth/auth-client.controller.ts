import { Controller, Post, Body, HttpCode, Res, HttpStatus, Req, Get, UseGuards } from "@nestjs/common";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	AccessTokenDto,
	BaseUserView,
	EmailDto,
	CreateGoogleUserDto,
} from "@libs/contracts/index";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { HttpStatuses, AuthRouterPaths } from "@libs/constants/index";
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
import { MeUserViewDto } from "@libs/contracts/auth-contracts/output/me-user-view.dto";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { CheckRecoveryCodeSwagger } from "@gateway/core/decorators/swagger/auth/check-recovery-code.decorator";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Environments } from "../../core/core.config";
import { GoogleGuard } from "@gateway/core/guards/google/google.guard";

@ApiTags(AuthRouterPaths.AUTH)
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
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	async passwordRecovery(@Body() passwordRecoveryDto: ResendEmailDto): Promise<void> {
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
	@Get(AuthRouterPaths.ME)
	@HttpCode(HttpStatus.OK)
	async me(@Req() request: Request): Promise<MeUserViewDto> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		const userInfo = await this.authClientService.me(refreshTokenFromCookie);
		return userInfo;
	}

	@ApiOperation({ summary: "Get users - TEST ENDPOINT" })
	@ApiOkResponse({ description: "Successfully received users", type: [BaseUserView] })
	@ApiUnauthorizedResponse({
		description: "If the access token is wrong or expired",
	})
	@ApiBearerAuth()
	@UseGuards(JwtAccessAuthGuard)
	@Get(AuthRouterPaths.USERS)
	@HttpCode(HttpStatus.OK)
	async getUsers(): Promise<BaseUserView[]> {
		const users = await this.authClientService.getUsers();
		return users;
	}

	@Get(AuthRouterPaths.GOOGLE_LOGIN)
	@UseGuards(GoogleGuard)
	async googleAuth() {}

	@Get(AuthRouterPaths.GOOGLE_CALLBACK)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(GoogleGuard)
	async googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
		const user = request.user as CreateGoogleUserDto;
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);

		const { accessToken, refreshToken } = await this.authClientService.registrationGoogle(user, metadata);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === Environments.PRODUCTION, // secure только в проде, а для тестов false
			sameSite: "lax",
		});

		console.log(accessToken, refreshToken);

		response.redirect(`https://ulens.org/?profile=${accessToken}`);
	}
}
