import { Module } from "@nestjs/common";
import { CoreModule } from "@auth/core/core.module";
import { UserController } from "@auth/modules/user/user.controller";
import { UserService } from "@auth/modules/user/user.service";
import {
	IUserCommandRepository,
	IUserQueryRepository,
} from "./user.interfaces";
import { PrismaUserCommandRepository } from "./repo/user.command.repo";
import { PrismaUserQueryRepository } from "./repo/user.query.repository";
import { UserEnvConfig } from "./user.config";
import { JwtModule } from "@nestjs/jwt";
import { SessionModule } from "../session/session.module";

/**
 * { provide: IUserCommandRepository, useClass: PrismaUserCommandRepository}
 * Явно указываем что при передаче зависимости IUserCommandRepository
 *    нужно использовать реализацию PrismaUserCommandRepository.
 *    Это необходимо, потому что интерфейсы TypeScript не существуют во время выполнения,
 *    и приложение не знает, какую реализацию подставить без явного связывания.
 */
@Module({
	imports: [
		CoreModule,
		SessionModule,
		JwtModule.registerAsync({
			useFactory: (userEnvConfig: UserEnvConfig) => ({
				secret: userEnvConfig.refreshTokenSecret,
			}),
			inject: [UserEnvConfig],
			extraProviders: [UserEnvConfig],
		}),
	],
	controllers: [UserController],
	providers: [
		UserService,
		UserEnvConfig,
		{ provide: IUserCommandRepository, useClass: PrismaUserCommandRepository },
		{ provide: IUserQueryRepository, useClass: PrismaUserQueryRepository },
	],
	exports: [UserService],
})
export class UserModule {}
