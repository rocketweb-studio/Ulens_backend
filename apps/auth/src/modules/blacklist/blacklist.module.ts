import { Module } from "@nestjs/common";
import { BlacklistService } from "@auth/modules/blacklist/blacklist.service";
import { PrismaBlacklistCommandRepository } from "@auth/modules/blacklist/repositories/blacklist.command.repository";
import { IBlacklistCommandRepository } from "@auth/modules/blacklist/blacklist.interface";

@Module({
	imports: [],
	controllers: [],
	providers: [
		BlacklistService,
		{
			provide: IBlacklistCommandRepository,
			useClass: PrismaBlacklistCommandRepository,
		},
	],
	exports: [BlacklistService],
})
export class BlacklistModule {}
