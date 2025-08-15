import { CreateUserDto, RegistrationResultView, ConfirmCodeDto, BaseUserView, ResendEmailDto } from "@libs/contracts/index";

/**
 *Using abstract classes lets Nest use the class itself as the DI token, 
 *   so your service can inject by type without @Inject()
 */

export abstract class IUserQueryRepository {
    // abstract findUserByConfirmationCode(dto: ConfirmCodeDto): Promise<BaseUserView | null>;
}

export abstract class IUserCommandRepository {
    abstract createUser(dto: CreateUserDto): Promise<RegistrationResultView>;
    abstract confirmEmail(dto: ConfirmCodeDto): Promise<Boolean>;
    abstract resendEmail(dto: ResendEmailDto): Promise<ConfirmCodeDto>;
}
