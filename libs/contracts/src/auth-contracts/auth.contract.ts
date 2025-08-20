import { CreateUserDto } from "./input/create-user.dto";
import { ConfirmCodeDto } from "./input/confirmation-code.dto";
import { ResendEmailDto } from "./input/resending-email.dto";
import { NewPasswordDto } from "./input/new-password.dto";
import { LoginDto } from "./input/login.dto";
import { SessionMetadataDto } from "./input/metadata.dto";

export interface IAuthClientService {
	registration(createUserDto: CreateUserDto): Promise<void>;

	emailConfirmation(confirmCodeDto: ConfirmCodeDto): Promise<void>;

	resendEmail(resendEmailDto: ResendEmailDto): Promise<void>;

	passwordRecovery(passwordRecoveryDto: ResendEmailDto): Promise<void>;

	setNewPassword(newPasswordDto: NewPasswordDto): Promise<void>;

	login(loginDto: LoginDto, metadata: SessionMetadataDto): Promise<{ accessToken: string; refreshToken: string }>;

	refreshTokens(refreshTokenFromCookie: string): Promise<{ accessToken: string; refreshToken: string }>;

	logout(refreshTokenFromCookie: string): Promise<void>;
}
