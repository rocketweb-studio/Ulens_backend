import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateUserDto, ConfirmCodeDto, ResendEmailDto, NewPasswordDto, LoginDto, SessionMetadataDto } from "@libs/contracts/index";
import { Microservice } from "@libs/constants/microservices";
import { AuthMessages } from "@libs/constants/auth-messages";
import { UnauthorizedRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { NotificationsClientService } from "../notifications/notifications-client.service";
import { JwtService } from "@nestjs/jwt";
import { AuthClientEnvConfig } from "./auth-client.config";
import { IAuthClientService } from "@libs/contracts/auth-contracts/auth.contract";
import { MainClientService } from "../main/main-client.service";

@Injectable()
export class AuthClientService implements IAuthClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly authEnvConfig: AuthClientEnvConfig,
		private readonly jwtService: JwtService,
		private readonly notificationsClientService: NotificationsClientService,
		private readonly mainClientService: MainClientService,
	) {}

	async registration(createUserDto: CreateUserDto): Promise<void> {
		const { userId, userName, email, confirmationCode } = await firstValueFrom(this.client.send({ cmd: AuthMessages.REGISTRATION }, createUserDto));

		const isProfileCreated = await this.mainClientService.createProfile({
			userName: userName,
			id: userId,
		});

		if (!isProfileCreated) {
			throw new UnexpectedErrorRpcException("Profile creation failed, REVERT");
		}

		this.notificationsClientService
			.sendRegistrationEmail({
				email: email,
				code: confirmationCode,
			})
			.catch((error) => {
				console.log(error);
			});

		return;
	}

	async emailConfirmation(confirmCodeDto: ConfirmCodeDto): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: AuthMessages.EMAIL_CONFIRMATION }, confirmCodeDto));
		return;
	}

	async resendEmail(resendEmailDto: ResendEmailDto): Promise<void> {
		const { confirmationCode } = await firstValueFrom(this.client.send({ cmd: AuthMessages.RESEND_EMAIL }, resendEmailDto));

		this.notificationsClientService
			.sendRegistrationEmail({
				email: resendEmailDto.email,
				code: confirmationCode,
			})
			.catch((error) => {
				console.log(error);
			});

		return;
	}

	async passwordRecovery(passwordRecoveryDto: ResendEmailDto): Promise<void> {
		const { code } = await firstValueFrom(this.client.send({ cmd: AuthMessages.PASSWORD_RECOVERY }, passwordRecoveryDto));

		this.notificationsClientService
			.sendPasswordRecoveryEmail({
				email: passwordRecoveryDto.email,
				code: code,
			})
			.catch((error) => {
				console.log(error);
			});

		return;
	}

	async setNewPassword(newPasswordDto: NewPasswordDto): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: AuthMessages.NEW_PASSWORD }, newPasswordDto));
		return;
	}

	async login(loginDto: LoginDto, metadata: SessionMetadataDto): Promise<{ accessToken: string; refreshToken: string }> {
		const { refreshToken, payloadForJwt } = await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGIN }, { loginDto, metadata }));
		const accessToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.authEnvConfig.accessTokenExpirationTime,
			secret: this.authEnvConfig.accessTokenSecret,
		});
		return { accessToken, refreshToken };
	}

	async refreshTokens(refreshTokenFromCookie: string): Promise<{ accessToken: string; refreshToken: string }> {
		if (!refreshTokenFromCookie) {
			throw new UnauthorizedRpcException();
		}
		const { refreshToken, payloadForJwt } = await firstValueFrom(
			this.client.send({ cmd: AuthMessages.REFRESH_TOKENS }, { refreshToken: refreshTokenFromCookie }),
		);

		const accessToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.authEnvConfig.accessTokenExpirationTime,
			secret: this.authEnvConfig.accessTokenSecret,
		});

		return { accessToken, refreshToken };
	}

	async logout(refreshTokenFromCookie: string): Promise<void> {
		const session = await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGOUT }, { refreshToken: refreshTokenFromCookie }));
		if (!session) {
			throw new UnexpectedErrorRpcException("Something went wrong");
		}

		return session;
	}
}
