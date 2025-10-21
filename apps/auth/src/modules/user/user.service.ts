import { Inject, Injectable } from "@nestjs/common";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	EmailDto,
	RegistrationGoogleOutputDto,
	CreateOauthUserDto,
	SessionMetadataDto,
} from "@libs/contracts/index";
import { IUserCommandRepository } from "./user.interfaces";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserEnvConfig } from "@auth/modules/user/user.config";
import { LoginInputDto } from "@auth/modules/user/dto/login.input.dto";
import { LoginOutputDto } from "@auth/modules/user/dto/login.output.dto";
import { randomUUID } from "crypto";
import { SessionService } from "@auth/modules/session/session.service";
import { add } from "date-fns";
import { BadRequestRpcException, UnexpectedErrorRpcException } from "@libs/exeption/index";
import { RegistrationOutputDto } from "@auth/modules/user/dto/registration.output.dto";
import { UserDbInputDto } from "@auth/modules/user/dto/user-db.input.dto";
import { ConfirmationCodeInputRepoDto } from "@auth/modules/user/dto/confirm-repo.input.dto";
import { RecoveryCodeInputRepoDto } from "@auth/modules/user/dto/recovery-repo.input.dto";
import { CodeOutputDto } from "@auth/modules/user/dto/code.output.dto";
import { NewPasswordInputRepoDto } from "@auth/modules/user/dto/new-pass-repo.input.dto";
import { BlacklistService } from "@auth/modules/blacklist/blacklist.service";
import { UserOauthDbInputDto } from "@auth/modules/user/dto/user-google-db.input.dto";
import { Oauth2Providers } from "@libs/constants/auth-messages";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserOutputRepoDto } from "@auth/modules/user/dto/user-repo.ouptut.dto";
import { RefreshDecodedDto } from "@auth/modules/user/dto/refresh-decoded.dto";
import { RedisService } from "@libs/redis/redis.service";
import { PremiumInputDto } from "@auth/modules/user/dto/premium.input.dto";

@Injectable()
export class UserService {
	constructor(
		@Inject() private readonly jwtService: JwtService,
		private readonly userCommandRepository: IUserCommandRepository,
		private readonly userEnvConfig: UserEnvConfig,
		private readonly sessionService: SessionService,
		private readonly blacklistService: BlacklistService,
		private readonly redisService: RedisService,
	) {}

	async createUser(dto: CreateUserDto): Promise<RegistrationOutputDto> {
		const { email, password, userName } = dto;

		const userField = await this.userCommandRepository.findUserByEmailOrUserName(email, userName);

		if (userField) {
			throw new BadRequestRpcException(`User with this ${userField.field.toLowerCase()} is already registered`, userField.field);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser: UserDbInputDto = {
			passwordHash,
			userName,
			email,
			confirmationCode: randomUUID(),
			confirmationCodeExpDate: add(new Date(), { hours: 1 }).toISOString(),
			confirmationCodeConfirmed: false,
		};

		const createdUser = await this.userCommandRepository.createUserAndProfile(newUser);

		if (!createdUser || !createdUser.confirmationCode) {
			throw new UnexpectedErrorRpcException("User was not created");
		}

		return {
			email: createdUser.email,
			confirmationCode: createdUser.confirmationCode,
		};
	}

	async registrationOauth2(dto: CreateOauthUserDto, metadata: any, provider: Oauth2Providers): Promise<RegistrationGoogleOutputDto> {
		const { email, providerProfileId, userName } = dto;
		let createdUser: UserOutputRepoDto | null = null;

		const providerField = provider === Oauth2Providers.GOOGLE ? "googleUserId" : "githubUserId";

		const existedUser = await this.userCommandRepository.findUserByEmail(email);

		if (existedUser && !existedUser[providerField]) {
			await this.userCommandRepository.setOauthUserId(email, { [providerField]: providerProfileId });
		}

		if (!existedUser) {
			const newUser: UserOauthDbInputDto = {
				userName,
				email,
				[providerField]: providerProfileId,
				confirmationCodeConfirmed: true,
			};

			createdUser = await this.userCommandRepository.createOauth2UserAndProfile(newUser);
		}

		const finalUser: any = existedUser ?? createdUser;

		if (!existedUser && !createdUser) {
			throw new BadRequestRpcException("Attempt to login by Google was failed");
		}

		const { refreshToken } = await this.issueRefreshTokenAndCreateSession(finalUser.id, metadata);

		return {
			refreshToken,
		};
	}

	async confirmEmail(dto: ConfirmCodeDto): Promise<boolean> {
		const result = await this.userCommandRepository.confirmEmail(dto);
		if (!result) {
			throw new BadRequestRpcException("User with this code was not found or code alredy expired");
		}
		return true;
	}

	async resendEmail(dto: ResendEmailDto): Promise<CodeOutputDto> {
		const user = await this.userCommandRepository.findUserByEmail(dto.email);

		if (!user) {
			throw new BadRequestRpcException("User with this email was not found", "email");
		}

		if (user.confirmationCodeConfirmed) {
			throw new BadRequestRpcException("User with this email already confirmed", "email");
		}

		const newConfirmationCodeBody: ConfirmationCodeInputRepoDto = {
			confirmationCode: randomUUID(),
			confirmationCodeExpDate: add(new Date(), { hours: 1 }).toISOString(),
			confirmationCodeConfirmed: false,
		};

		const confirmationCode = await this.userCommandRepository.resendEmail(dto.email, newConfirmationCodeBody);

		if (!confirmationCode) {
			throw new UnexpectedErrorRpcException("Confirmation code was not updated");
		}

		return { code: confirmationCode };
	}

	async passwordRecovery(dto: ResendEmailDto): Promise<CodeOutputDto> {
		const user = await this.userCommandRepository.findUserByEmail(dto.email);

		if (!user) {
			throw new BadRequestRpcException("User with this email was not found", "email");
		}

		const recoveryCodeBody: RecoveryCodeInputRepoDto = {
			recoveryCode: randomUUID(),
			recoveryCodeExpDate: add(new Date(), { hours: 1 }).toISOString(),
		};

		const recoveryCode = await this.userCommandRepository.passwordRecovery(dto.email, recoveryCodeBody);

		if (!recoveryCode) {
			throw new UnexpectedErrorRpcException("Recovery code was not updated");
		}

		return { code: recoveryCode };
	}

	async setNewPassword(dto: NewPasswordDto): Promise<boolean> {
		const { newPassword, recoveryCode } = dto;

		const user = await this.userCommandRepository.findUserByRecoveryCode(recoveryCode);

		if (!user) {
			throw new BadRequestRpcException("User with this recovery code was not found", "recoveryCode");
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		const newPasswordBody: NewPasswordInputRepoDto = {
			recoveryCode: null,
			recoveryCodeExpDate: null,
			passwordHash: newPasswordHash,
		};

		const result = await this.userCommandRepository.setNewPassword(user.id, newPasswordBody);

		if (!result) {
			throw new BadRequestRpcException("New password was not set");
		}
		await this.sessionService.deleteAllSessions(user.id);

		return true;
	}

	async checkRecoveryCode(checkRecoveryCodeDto: ConfirmCodeDto): Promise<EmailDto> {
		const user = await this.userCommandRepository.findUserByRecoveryCode(checkRecoveryCodeDto.code);

		if (!user) {
			throw new BadRequestRpcException("User with this recovery code was not found", "recoveryCode");
		}

		return { email: user.email };
	}

	async login(dto: LoginInputDto): Promise<LoginOutputDto> {
		const { refreshToken, payloadForJwt } = await this.issueRefreshTokenAndCreateSession(dto.loginDto.id, dto.metadata);

		return { refreshToken, payloadForJwt };
	}

	async validateUser(payload: LoginDto): Promise<any> {
		const user = await this.userCommandRepository.findUserByEmail(payload.email);
		if (!user || !user.passwordHash) {
			return null;
		}

		const passwordIsValid = await bcrypt.compare(payload.password, user.passwordHash);
		if (!passwordIsValid) {
			return null;
		}

		return user;
	}

	async refreshTokens(dto: RefreshDecodedDto): Promise<{ refreshToken: string; payloadForJwt: any }> {
		const { refreshToken: oldRefreshToken, deviceId, userId } = dto;
		const payloadForJwt = {
			userId,
			deviceId,
		};

		const refreshToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.userEnvConfig.refreshTokenExpirationTime,
			secret: this.userEnvConfig.refreshTokenSecret,
		});

		const payloadFromJwt = this.jwtService.decode(refreshToken);
		await this.sessionService.updateSession(deviceId, payloadFromJwt);

		const payloadFromOldRefreshToken = this.jwtService.decode(oldRefreshToken);
		await this.blacklistService.addTokenToBlacklist(oldRefreshToken, payloadFromOldRefreshToken);

		return { refreshToken, payloadForJwt };
	}

	async logout(dto: RefreshDecodedDto): Promise<any> {
		const session = await this.sessionService.deleteSession(dto.deviceId);
		return session;
	}

	async activatePremiumStatus(payload: PremiumInputDto) {
		return this.userCommandRepository.activatePremiumStatus(payload);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteNotConfirmedUsers() {
		console.log("Delete not confirmed users");
		await this.userCommandRepository.deleteNotConfirmedUsers();
	}

	private async issueRefreshTokenAndCreateSession(
		userId: string,
		metadata: SessionMetadataDto,
	): Promise<{ refreshToken: string; payloadForJwt: { userId: string; deviceId: string } }> {
		const deviceId = randomUUID();

		const payloadForJwt = {
			userId,
			deviceId,
		};

		// проверка на работоспособность redis
		await this.redisService.set(deviceId, JSON.stringify(payloadForJwt), "EX", 60 * 60 * 1000);

		const refreshToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.userEnvConfig.refreshTokenExpirationTime,
			secret: this.userEnvConfig.refreshTokenSecret,
		});

		// проверка на существование deviceId в redis
		console.log("Saved session in redis: ", await this.redisService.get(deviceId));

		const payloadFromJwt = this.jwtService.decode(refreshToken); // string | object | null
		await this.sessionService.createSession(userId, deviceId, metadata, payloadFromJwt);

		return { refreshToken, payloadForJwt };
	}

	async deleteUser(userId: string): Promise<any> {
		return this.userCommandRepository.deleteUser(userId);
	}

	async setBlockStatusForUser(userId: string, isBlocked: boolean, reason: string | null): Promise<boolean> {
		return this.userCommandRepository.setBlockStatusForUser(userId, isBlocked, reason);
	}
}
