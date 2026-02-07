import { Module } from "@nestjs/common";
import { ProfileService } from "@auth/modules/profile/profile.service";
import { PrismaProfileCommandRepository } from "@auth/modules/profile/infrastructure/profile.command.repository";
import { IProfileCommandRepository, IProfileQueryRepository } from "@auth/modules/profile/profile.interfaces";
import { PrismaProfileQueryRepository } from "@auth/modules/profile/infrastructure/profile.query.repository";
import { ProfileController } from "@auth/modules/profile/profile.controller";

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
