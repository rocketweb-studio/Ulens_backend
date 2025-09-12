import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { PrismaProfileCommandRepository } from "./repositories/profile.command.repository";
import { IProfileCommandRepository, IProfileQueryRepository } from "./profile.interfaces";
import { PrismaProfileQueryRepository } from "./repositories/profile.query.repository";
import { ProfileController } from "./profile.controller";

@Module({
	imports: [],
	controllers: [ProfileController],
	providers: [
		ProfileService,
		{
			provide: IProfileCommandRepository,
			useClass: PrismaProfileCommandRepository,
		},
		{
			provide: IProfileQueryRepository,
			useClass: PrismaProfileQueryRepository,
		},
	],
	exports: [],
})
export class ProfileModule {}
