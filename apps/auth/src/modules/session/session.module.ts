import { Module } from "@nestjs/common";
import { SessionService } from "@auth/modules/session/session.service";
import { PrismaSessionCommandRepository } from "@auth/modules/session/repositories/session.command.repository";
import { PrismaSessionQueryRepository } from "@auth/modules/session/repositories/session.query.repository";
import { ISessionCommandRepository, ISessionQueryRepository } from "@auth/modules/session/session.interfaces";

@Module({
	imports: [],
	controllers: [],
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
