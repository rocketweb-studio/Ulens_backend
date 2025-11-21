import { Module } from "@nestjs/common";
import { SessionService } from "@auth/modules/session/session.service";
import { PrismaSessionCommandRepository } from "@auth/modules/session/infrastructure/session.command.repository";
import { PrismaSessionQueryRepository } from "@auth/modules/session/infrastructure/session.query.repository";
import { ISessionCommandRepository, ISessionQueryRepository } from "@auth/modules/session/session.interfaces";
import { SessionController } from "@auth/modules/session/session.controller";
@Module({
	imports: [],
	controllers: [SessionController],
	providers: [
		SessionService,
		{
			provide: ISessionCommandRepository,
			useClass: PrismaSessionCommandRepository,
		},
		{
			provide: ISessionQueryRepository,
			useClass: PrismaSessionQueryRepository,
		},
	],
	exports: [
		SessionService,
		{
			provide: ISessionQueryRepository,
			useClass: PrismaSessionQueryRepository,
		},
	],
})
export class SessionModule {}
