import { CreateUserDto, RegistrationResultView, ConfirmCodeDto, BaseUserView, ResendEmailDto, NewPasswordDto, ResendEmailConfCodeDto, RecoveryPasswordDto, NewPasswordRepoDto } from "@libs/contracts/index";
import { User } from "./user.entity";

/**
 *Using abstract classes lets Nest use the class itself as the DI token, 
 *   so your service can inject by type without @Inject()
 */

export abstract class IUserQueryRepository {
    // abstract findUserByConfirmationCode(dto: ConfirmCodeDto): Promise<BaseUserView | null>;
}

export abstract class IUserCommandRepository {
    abstract createUser(userDto: User): Promise<RegistrationResultView>;
    abstract confirmEmail(dto: ConfirmCodeDto): Promise<Boolean>;
    abstract resendEmail(dto: ResendEmailConfCodeDto): Promise<ConfirmCodeDto>;
    abstract passwordRecovery(dto: RecoveryPasswordDto): Promise<ConfirmCodeDto>;
    abstract setNewPassword(dto: NewPasswordRepoDto): Promise<Boolean>;

}
