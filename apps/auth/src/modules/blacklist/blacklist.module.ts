import { Module } from "@nestjs/common";
import { BlacklistService } from "./blacklist.service";
import { PrismaBlacklistCommandRepository } from "./repositories/blacklist.command.repository";
import { IBlacklistCommandRepository } from "./blacklist.interface";

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
