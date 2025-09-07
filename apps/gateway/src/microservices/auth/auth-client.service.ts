import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	SessionMetadataDto,
	CreateOauthUserDto,
	UserConfirmationOutputDto,
} from "@libs/contracts/index";
import { Microservice } from "@libs/constants/microservices";
import { AuthMessages, Oauth2Providers } from "@libs/constants/auth-messages";
import { UnauthorizedRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { NotificationsClientService } from "../notifications/notifications-client.service";
import { JwtService } from "@nestjs/jwt";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { IAuthClientService } from "@libs/contracts/auth-contracts/auth.contract";
import { MeUserViewDto } from "@libs/contracts/index";
import * as amqp from "amqplib";
import { EventEnvelope } from "@libs/contracts/index";
import { randomUUID } from "crypto";

@Injectable()
export class AuthClientService implements IAuthClientService {
	// rabbitmq заглушка(закомментировать)
	private readonly ch: amqp.Channel;
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		// rabbitmq заглушка
		// @Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel,
		private readonly authEnvConfig: AuthClientEnvConfig,
		private readonly jwtService: JwtService,
		private readonly notificationsClientService: NotificationsClientService,
	) {}

	async registration(createUserDto: CreateUserDto): Promise<void> {
		const { email, confirmationCode } = await firstValueFrom(this.client.send({ cmd: AuthMessages.REGISTRATION }, createUserDto));

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

	async registrationOauth2(registerDto: CreateOauthUserDto, metadata: SessionMetadataDto, provider: Oauth2Providers): Promise<{ refreshToken: string }> {
		const { refreshToken } = await firstValueFrom(this.client.send({ cmd: AuthMessages.REGISTRATION_OAUTH2 }, { registerDto, metadata, provider }));

		return { refreshToken };
	}

	async emailConfirmation(confirmCodeDto: ConfirmCodeDto): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: AuthMessages.EMAIL_CONFIRMATION }, confirmCodeDto));
		return;
	}

	async resendEmail(resendEmailDto: ResendEmailDto): Promise<void> {
		const { code } = await firstValueFrom(this.client.send({ cmd: AuthMessages.RESEND_EMAIL }, resendEmailDto));

		this.notificationsClientService
			.sendRegistrationEmail({
				email: resendEmailDto.email,
				code: code,
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

	async checkRecoveryCode(checkRecoveryCodeDto: ConfirmCodeDto): Promise<{ email: string }> {
		const { email } = await firstValueFrom(this.client.send({ cmd: AuthMessages.CHECK_RECOVERY_CODE }, checkRecoveryCodeDto));
		return { email };
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

	async me(refreshTokenFromCookie: string): Promise<MeUserViewDto> {
		const userInfo = await firstValueFrom(this.client.send({ cmd: AuthMessages.ME }, { refreshToken: refreshTokenFromCookie }));
		return userInfo;
	}

	async getUsers(): Promise<MeUserViewDto[]> {
		const users = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS }, {}));
		return users;
	}

	async getUserConfirmation(email: string): Promise<UserConfirmationOutputDto> {
		const user = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USER_CONFIRMATION_BY_EMAIL }, { email }));
		return user;
	}

	// тестовый метод для публикации сообщения
	async publishTestEvent() {
		const event = {
			messageId: Date.now().toString(),
			type: "test.event",
			payload: { hello: "world" },
		};

		this.ch.publish(
			"app.events", // exchange
			"test.event", // routing key
			Buffer.from(JSON.stringify(event)),
			{ persistent: true, contentType: "application/json" },
		);
		console.log("[RMQ] Published test.event:", event);
	}

	// тестовый метод с "реальным" событием
	async publishUserRegisteredEvent() {
		const event: EventEnvelope<{ userId: string; email: string }> = {
			messageId: randomUUID(),
			traceId: randomUUID(),
			type: "auth.user.registered.v1", // ← новый тип
			occurredAt: new Date().toISOString(),
			producer: "gateway", // пока публикуем из gateway
			payload: { userId: "demo-user-id", email: "demo@example.com" },
		};

		this.ch.publish(
			"app.events", // общий topic exchange
			"auth.user.registered.v1", // ← routing key в тему события
			Buffer.from(JSON.stringify(event)),
			{ persistent: true, contentType: "application/json" },
		);
		console.log("[RMQ] Published auth.user.registered.v1:", event);
	}
}
