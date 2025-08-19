import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import {
	CreateUserDto,
	BaseUserView,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	SessionMetadataDto,
} from "@libs/contracts/index";
import { Microservice } from "@libs/constants/microservices";
import { AuthMessages } from "@libs/constants/auth-messages";
import {
	UnauthorizedRpcException,
	UnexpectedErrorRpcException,
} from "@libs/exeption/rpc-exeption";
import { NotificationsClientService } from "../notifications/notifications-client.service";
import { JwtService } from "@nestjs/jwt";
import { AuthClientEnvConfig } from "./auth-client.config";

@Injectable()
export class AuthClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly authEnvConfig: AuthClientEnvConfig,
		private readonly jwtService: JwtService,
		private readonly notificationsClientService: NotificationsClientService,
	) {}

	// async getUsers(): Promise<BaseUserView[]> {
	//   return firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS }, {}));
	// }

	// async createUser(createUserDto: CreateUserDto): Promise<BaseUserView> {
	//   try {
	//     const response = await firstValueFrom(this.client.send({ cmd: AuthMessages.CREATE_USER }, createUserDto));
	//     return response;
	//   } catch (e) {
	//     // можно использовать InternalServerErrorException и тогда будет использоваться фильтр для http ошибок
	//     throw new UnexpectedErrorRpcException(e.message);
	//   }
	// }

	async registration(createUserDto: CreateUserDto): Promise<BaseUserView> {
		const { user, confirmationCode } = await firstValueFrom(
			this.client.send({ cmd: AuthMessages.REGISTRATION }, createUserDto),
		);

		if (user?.email && confirmationCode) {
			this.notificationsClientService.sendRegistrationEmail({
				email: user.email,
				code: confirmationCode,
			});
		} else {
			console.log("Registration succeeded but email data is missing");
		}

		return user;
	}

	async emailConfirmation(confirmCodeDto: ConfirmCodeDto): Promise<boolean> {
		return firstValueFrom(
			this.client.send(
				{ cmd: AuthMessages.EMAIL_CONFIRMATION },
				confirmCodeDto,
			),
		);
	}

	async resendEmail(resendEmailDto: ResendEmailDto): Promise<boolean> {
		const { code } = await firstValueFrom(
			this.client.send({ cmd: AuthMessages.RESEND_EMAIL }, resendEmailDto),
		);

		if (code) {
			this.notificationsClientService.sendRegistrationEmail({
				email: resendEmailDto.email,
				code: code,
			});
		} else {
			console.log(
				"Email confirmation code was updated but email data is missing",
			);
		}

		return true;
	}

	async passwordRecovery(
		passwordRecoveryDto: ResendEmailDto,
	): Promise<boolean> {
		const { code } = await firstValueFrom(
			this.client.send(
				{ cmd: AuthMessages.PASSWORD_RECOVERY },
				passwordRecoveryDto,
			),
		);

		if (code) {
			this.notificationsClientService.sendPasswordRecoveryEmail({
				email: passwordRecoveryDto.email,
				code: code,
			});
		} else {
			console.log(
				"Password recovery code was updated but email data is missing",
			);
		}

		return true;
	}

	async setNewPassword(newPasswordDto: NewPasswordDto): Promise<boolean> {
		return firstValueFrom(
			this.client.send({ cmd: AuthMessages.NEW_PASSWORD }, newPasswordDto),
		);
	}

	async login(
		loginDto: LoginDto,
		metadata: SessionMetadataDto,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { refreshToken, payloadForJwt } = await firstValueFrom(
			this.client.send({ cmd: AuthMessages.LOGIN }, { loginDto, metadata }),
		);
		const accessToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.authEnvConfig.accessTokenExpirationTime,
			secret: this.authEnvConfig.accessTokenSecret,
		});
		return { accessToken, refreshToken };
	}

	async refreshTokens(
		refreshTokenFromCookie: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		if (!refreshTokenFromCookie) {
			throw new UnauthorizedRpcException();
		}
		const { refreshToken, payloadForJwt } = await firstValueFrom(
			this.client.send(
				{ cmd: AuthMessages.REFRESH_TOKENS },
				{ refreshToken: refreshTokenFromCookie },
			),
		);

		const accessToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.authEnvConfig.accessTokenExpirationTime,
			secret: this.authEnvConfig.accessTokenSecret,
		});

		return { accessToken, refreshToken };
	}

	async logout(refreshTokenFromCookie: string): Promise<void> {
		const session = await firstValueFrom(
			this.client.send(
				{ cmd: AuthMessages.LOGOUT },
				{ refreshToken: refreshTokenFromCookie },
			),
		);
		if (!session) {
			throw new UnexpectedErrorRpcException("Something went wrong");
		}

		return session;
	}
}
