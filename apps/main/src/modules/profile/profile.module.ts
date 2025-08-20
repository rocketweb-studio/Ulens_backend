import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaProfileCommandRepository } from "./repositories/profile.command.repository";
import { IProfileCommandRepository } from "./profile.interfaces";

@Module({
	imports: [],
	controllers: [ProfileController],
	providers: [
		ProfileService,
		{
			provide: IProfileCommandRepository,
			useClass: PrismaProfileCommandRepository,
		},
	],
	exports: [],
})
export class ProfileModule {}
