import {
	Controller,
	Post,
	Body,
	HttpCode,
	Res,
	HttpStatus,
	Req,
} from "@nestjs/common";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";
import {
	CreateUserDto,
	BaseUserView,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	AccessTokenDto,
} from "@libs/contracts/index";
import {
	ApiBearerAuth,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HttpStatuses, RouterPaths } from "@libs/constants/index";
import { IncorrectInputDataResponse } from "../../common/swagger-examples/incorrect-input-data-response";
import { Response, Request } from "express";
import { getSessionMetadata } from "@gateway/utils/session-metadata.util";
import { BadRequestResponse } from "@gateway/common/swagger-examples/BadRequestResponse";

@ApiTags(RouterPaths.AUTH)
@Controller(RouterPaths.AUTH)
export class AuthClientController {
	constructor(private readonly authClientService: AuthClientService) {}

	// @Get(RouterPaths.USERS)
	// @UseGuards(JwtAccessAuthGuard)
	// @ApiOperation({ summary: 'Get a list of users' })
	// // @ApiResponse({ status:200, description: "Success" }) /*пример без Example Value | Schema*/
	// // @ApiOkResponse({ description: "Success" })  /*то же самое но более короткая форма*/
	// @ApiOkResponse({ type: UsersModel })
	// async getUsers(): Promise<BaseUserView[]> {
	//   const response = await this.authClientService.getUsers();
	//   return response;
	// }

	// @Post(RouterPaths.USERS)
	// async createUser(@Body() createUserDto: CreateUserDto): Promise<BaseUserView> {
	//   return this.authClientService.createUser(createUserDto);
	// }

	@Post(RouterPaths.REGISTRATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	@ApiOperation({
		summary:
			"Registrate a new user. Email with confirmation code will be send to passed email address.",
	})
	@ApiResponse({
		status: 204,
		description: `An email with a verification code has been sent to the specified email address`,
	})
	@ApiResponse(IncorrectInputDataResponse)
	async registration(
		@Body() createUserDto: CreateUserDto,
	): Promise<BaseUserView> {
		return this.authClientService.registration(createUserDto);
	}

	@Post(RouterPaths.REGISTRATION_CONFIRMATION)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	@ApiOperation({ summary: "Confirm registration" })
	@ApiResponse({
		status: 204,
		description: "Email was verified. Account was activated",
	})
	@ApiResponse(IncorrectInputDataResponse)
	async registrationConfirmation(
		@Body() confirmCodeDto: ConfirmCodeDto,
	): Promise<boolean> {
		return this.authClientService.emailConfirmation(confirmCodeDto);
	}

	@Post(RouterPaths.REGISTRATION_EMAIL_RESENDING)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	@ApiOperation({
		summary: "Resend confirmation registration Email if user exists",
	})
	@ApiResponse({
		status: 204,
		description:
			"An email with a verification code has been sent to the specified email address",
	})
	@ApiResponse(IncorrectInputDataResponse)
	async registrationEmailResending(
		@Body() resendEmailDto: ResendEmailDto,
	): Promise<boolean> {
		return this.authClientService.resendEmail(resendEmailDto);
	}

	@Post(RouterPaths.PASSWORD_RECOVERY)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	@ApiOperation({
		summary:
			"Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
	})
	@ApiResponse({
		status: 204,
		description:
			"An email with a recovery code has been sent to the specified email address",
	})
	@ApiResponse(IncorrectInputDataResponse)
	async passwordRecovery(
		@Body() passwordRecoveryDto: ResendEmailDto,
	): Promise<boolean> {
		return this.authClientService.passwordRecovery(passwordRecoveryDto);
	}

	@Post(RouterPaths.NEW_PASSWORD)
	@HttpCode(HttpStatuses.NO_CONTENT_204)
	@ApiOperation({ summary: "Confirm Password recovery" })
	@ApiResponse({
		status: 204,
		description: "New password was successfully set",
	})
	@ApiResponse(BadRequestResponse)
	async newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<boolean> {
		return this.authClientService.setNewPassword(newPasswordDto);
	}

	@ApiOperation({ summary: "Login user" })
	@ApiOkResponse({
		description: "User was successfully logged in",
		type: AccessTokenDto,
	})
	@ApiUnauthorizedResponse({
		description: "If the password or login or email is wrong",
	})
	@Post(RouterPaths.LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() loginDto: LoginDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AccessTokenDto> {
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);
		const { accessToken, refreshToken } = await this.authClientService.login(
			loginDto,
			metadata,
		);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		return { accessToken };
	}

	@ApiOperation({ summary: "Generate new pair of jwt tokens" })
	@ApiOkResponse({
		description: "Token pair was successfully refreshed",
		type: AccessTokenDto,
	})
	@ApiUnauthorizedResponse({
		description: "If the refresh token is wrong or expired",
	})
	@ApiBearerAuth()
	@Post(RouterPaths.REFRESH_TOKENS)
	@HttpCode(HttpStatus.OK)
	async refreshTokens(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AccessTokenDto> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		const { accessToken, refreshToken } =
			await this.authClientService.refreshTokens(refreshTokenFromCookie);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		return { accessToken };
	}

	@ApiOperation({ summary: "Logout user" })
	@ApiNoContentResponse({ description: "User was successfully logged out" })
	@ApiUnauthorizedResponse({
		description: "If the refresh token is wrong or expired",
	})
	@ApiBearerAuth()
	@Post(RouterPaths.LOGOUT)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<void> {
		const refreshTokenFromCookie = request.cookies?.refreshToken;
		await this.authClientService.logout(refreshTokenFromCookie);
		response.clearCookie("refreshToken");
		return;
	}
}
