import { Module } from "@nestjs/common";
import { SessionService } from "@auth/modules/session/session.service";
import { PrismaSessionCommandRepository } from "./repositories/session.command.repository";
import { PrismaSessionQueryRepository } from "./repositories/session.query.repository";
import { ISessionCommandRepository, ISessionQueryRepository } from "./session.interfaces";

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
