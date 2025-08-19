import { Inject, Injectable } from "@nestjs/common";
import {
	CreateUserDto,
	ConfirmCodeDto,
	ResendEmailDto,
	RegistrationResultView,
	NewPasswordDto,
	LoginDto,
} from "@libs/contracts/index";
import { IUserCommandRepository } from "./user.interfaces";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from "@nestjs/jwt";
import { UserEnvConfig } from "./user.config";
import { UserWithPayloadFromJwt } from "@auth/modules/user/dto/user.dto";
import { LoginInputDto } from "./dto/login-input.dto";
import { LoginOutputDto } from "./dto/login-output.dto";
import { randomUUID } from "crypto";
import { SessionService } from "@auth/modules/session/session.service";

@Injectable()
export class UserService {
	constructor(
		@Inject() private readonly jwtService: JwtService,
		private readonly userCommandRepository: IUserCommandRepository,
		private readonly userEnvConfig: UserEnvConfig,
		private readonly sessionService: SessionService,
	) {}

	// // !this method was added as example and must be removed later
	// async getUsers() {
	//   const users = await this.prisma.user.findMany();
	//   return users;
	// }

	// // !this method was added as example and must be removed later
	// async createUserExample(createUserDto: CreateUserDto) {
	//   const user = await this.prisma.user.create({

	//     data: createUserDto
	//   });
	//   return BaseUserView.mapToView(user);
	// }

	async createUser(dto: CreateUserDto): Promise<RegistrationResultView> {
		const { email, password, userName } = dto;

		const passwordHash = await bcrypt.hash(password, 10);

		const userEntity = new User(userName, email, passwordHash);
		// throw new BadRequestRpcException('User with such email was not found');

		return this.userCommandRepository.createUser(userEntity);
	}

	async confirmEmail(dto: ConfirmCodeDto): Promise<boolean> {
		return this.userCommandRepository.confirmEmail(dto);
	}

	async resendEmail(dto: ResendEmailDto): Promise<ConfirmCodeDto> {
		const confirmationCode = uuidv4();

		return this.userCommandRepository.resendEmail({ ...dto, confirmationCode });
	}

	async passwordRecovery(dto: ResendEmailDto): Promise<ConfirmCodeDto> {
		const recoveryCode = uuidv4();

		return this.userCommandRepository.passwordRecovery({
			...dto,
			recoveryCode,
		});
	}

	async setNewPassword(dto: NewPasswordDto): Promise<boolean> {
		const { newPassword, recoveryCode } = dto;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		return this.userCommandRepository.setNewPassword({
			recoveryCode,
			newPasswordHash,
		});
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

		//TODO: fix this when user id will be uuid
		await this.sessionService.createSession(
			//@ts-expect-error TODO: fix this when user id will be uuid
			dto.loginDto.id,
			deviceId,
			dto.metadata,
			payloadFromJwt,
		);

		//@ts-expect-error TODO: fix this when user id will be uuid
		return { refreshToken, payloadForJwt };
	}

	async validateUser(payload: LoginDto): Promise<any> {
		const user = await this.userCommandRepository.findUserByEmail(
			payload.email,
		);
		if (!user) {
			return null;
		}

		const passwordIsValid = await bcrypt.compare(
			payload.password,
			user.passwordHash,
		);
		if (!passwordIsValid) {
			return null;
		}

		return user;
	}

	async refreshTokens(
		dto: UserWithPayloadFromJwt,
	): Promise<{ refreshToken: string; payloadForJwt: any }> {
		const payloadForJwt = {
			userId: dto.userId,
			deviceId: dto.deviceId,
		};

		const refreshToken = await this.jwtService.signAsync(payloadForJwt, {
			expiresIn: this.userEnvConfig.refreshTokenExpirationTime,
			secret: this.userEnvConfig.refreshTokenSecret,
		});

		const payloadFromJwt = this.jwtService.decode(refreshToken);
		await this.sessionService.updateSession(dto.deviceId, payloadFromJwt);

		// TODO: add old refresh token to blacklist

		return { refreshToken, payloadForJwt };
	}

	async logout(dto: UserWithPayloadFromJwt): Promise<any> {
		const session = await this.sessionService.deleteSession(dto.deviceId);
		return session;
	}
}
