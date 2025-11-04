import { forwardRef, Module } from "@nestjs/common";
import { CoreModule } from "@auth/core/core.module";
import { UserController } from "@auth/modules/user/user.controller";
import { UserService } from "@auth/modules/user/user.service";
import { IUserCommandRepository, IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaUserCommandRepository } from "@auth/modules/user/repositories/user.command.repository";
import { PrismaUserQueryRepository } from "@auth/modules/user/repositories/user.query.repository";
import { UserEnvConfig } from "@auth/modules/user/user.config";
import { JwtModule } from "@nestjs/jwt";
import { SessionModule } from "@auth/modules/session/session.module";
import { BlacklistModule } from "@auth/modules/blacklist/blacklist.module";
import { EventStoreModule } from "@auth/modules/event-store/event-store.module";
import { UserQueryHelper } from "@auth/modules/user/repositories/user.query.repo.helper";
/**
 * { provide: IUserCommandRepository, useClass: PrismaUserCommandRepository}
 * Явно указываем что при передаче зависимости IUserCommandRepository
 *    нужно использовать реализацию PrismaUserCommandRepository.
 *    Это необходимо, потому что интерфейсы TypeScript не существуют во время выполнения,
 *    и приложение не знает, какую реализацию подставить без явного связывания.
 */
@Module({
	imports: [
		forwardRef(() => CoreModule),
		SessionModule,
		BlacklistModule,
		JwtModule.registerAsync({
			useFactory: (userEnvConfig: UserEnvConfig) => ({
				secret: userEnvConfig.refreshTokenSecret,
			}),
			inject: [UserEnvConfig],
			extraProviders: [UserEnvConfig],
		}),
		EventStoreModule,
	],
	controllers: [UserController],
	providers: [
		UserService,
		UserEnvConfig,
		UserQueryHelper,
		{ provide: IUserCommandRepository, useClass: PrismaUserCommandRepository },
		{ provide: IUserQueryRepository, useClass: PrismaUserQueryRepository },
	],
	exports: [UserService, IUserCommandRepository],
})
export class UserModule {}
