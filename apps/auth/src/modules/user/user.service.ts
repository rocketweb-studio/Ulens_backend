import { Inject, Injectable } from "@nestjs/common";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	NewPasswordDto,
	LoginDto,
	EmailDto,
	BaseUserView,
	RegistrationGoogleOutputDto,
} from "@libs/contracts/index";
import { IUserCommandRepository } from "./user.interfaces";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserEnvConfig } from "./user.config";
import { UserWithPayloadFromJwt } from "@auth/modules/user/dto/user.dto";
import { LoginInputDto } from "./dto/login-input.dto";
import { LoginOutputDto } from "./dto/login-output.dto";
import { randomUUID } from "crypto";
import { SessionService } from "@auth/modules/session/session.service";
import { add } from "date-fns";
import { BadRequestRpcException, UnexpectedErrorRpcException } from "@libs/exeption/index";
import { RegistrationOutputDto } from "./dto/registration-output.dto";
import { UserDbInputDto } from "./dto/user-db-input.dto";
import { ConfirmationCodeInputRepoDto } from "./dto/confirm-input-repo.dto";
import { RecoveryCodeInputRepoDto } from "./dto/recovery-input-repo.dto";
import { CodeOutputDto } from "./dto/code-output.dto";
import { NewPasswordInputRepoDto } from "./dto/new-pass-input-repo.dto";
import { BlacklistService } from "../blacklist/blacklist.service";
import { UserGoogleDbInputDto } from "./dto/user-google-db-input.dto";
import { GoogleRegisterInputDto } from "./dto/google-register-input.dto";

@Injectable()
export class UserService {
	constructor(
		@Inject() private readonly jwtService: JwtService,
		private readonly userCommandRepository: IUserCommandRepository,
		private readonly userEnvConfig: UserEnvConfig,
		private readonly sessionService: SessionService,
		private readonly blacklistService: BlacklistService,
	) {}

	async createUser(dto: CreateUserDto): Promise<RegistrationOutputDto> {
		const { email, password, userName } = dto;

		const userField = await this.userCommandRepository.findUserByEmailOrUserName(email, userName);

		if (userField) {
			throw new BadRequestRpcException(`User with this ${userField.field} is already registered`, userField.field);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser: UserDbInputDto = {
			id: randomUUID(),
			userName,
			passwordHash,
			email,
			confirmationCode: randomUUID(),
			confirmationCodeExpDate: add(new Date(), { hours: 1 }).toISOString(),
			confirmationCodeConfirmed: false,
		};

		const createdUser = await this.userCommandRepository.createUser(newUser);

		return {
			userId: createdUser.id,
			userName,
			email: createdUser.email,
			confirmationCode: createdUser.confirmationCode,
		};
	}

	async registrationGoogle(dto: GoogleRegisterInputDto): Promise<RegistrationGoogleOutputDto> {
		const { email, googleUserId, userName } = dto.registerDto;
		let createdUser: BaseUserView | null = null;

		const existedUser = await this.userCommandRepository.findUserByEmail(email);

		if (existedUser && !existedUser.googleUserId) {
			await this.userCommandRepository.setGoogleUserId(email, googleUserId);
		}

		if (!existedUser) {
			const newUser: UserGoogleDbInputDto = {
				id: randomUUID(),
				userName,
				email,
				googleUserId,
				confirmationCodeConfirmed: true,
			};

			createdUser = await this.userCommandRepository.createGoogleUser(newUser);
		}

		const finalUser: any = existedUser ?? createdUser;

		if (!existedUser && !createdUser) {
			throw new BadRequestRpcException("Attempt to login by Google was failed");
		}

		//! ---эту логику вероятно позже можно будет выполнять в login, но нужно переписывать типизацию
		const deviceId = randomUUID();
		const payloadForJwt = {
			userId: finalUser.id,
			deviceId,
		};

		const refreshToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.userEnvConfig.refreshTokenExpirationTime,
			secret: this.userEnvConfig.refreshTokenSecret,
		});

		const payloadFromJwt = this.jwtService.decode(refreshToken);

		await this.sessionService.createSession(finalUser.id, deviceId, dto.metadata, payloadFromJwt);
		//! ----

		return {
			id: finalUser.id,
			userName: finalUser.userName,
			existedUser: !!existedUser,
			refreshToken,
			payloadForJwt,
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
		const deviceId = randomUUID();
		const payloadForJwt = {
			userId: dto.loginDto.id,
			deviceId,
		};

		const refreshToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.userEnvConfig.refreshTokenExpirationTime,
			secret: this.userEnvConfig.refreshTokenSecret,
		});

		const payloadFromJwt = this.jwtService.decode(refreshToken);

		await this.sessionService.createSession(dto.loginDto.id, deviceId, dto.metadata, payloadFromJwt);

		return { refreshToken, payloadForJwt };
	}

	async validateUser(payload: LoginDto): Promise<any> {
		const user = await this.userCommandRepository.findUserByEmail(payload.email);
		if (!user) {
			return null;
		}

		const passwordIsValid = await bcrypt.compare(payload.password, user.passwordHash);
		if (!passwordIsValid) {
			return null;
		}

		return user;
	}

	async refreshTokens(dto: UserWithPayloadFromJwt): Promise<{ refreshToken: string; payloadForJwt: any }> {
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

	async logout(dto: UserWithPayloadFromJwt): Promise<any> {
		const session = await this.sessionService.deleteSession(dto.deviceId);
		return session;
	}
}
