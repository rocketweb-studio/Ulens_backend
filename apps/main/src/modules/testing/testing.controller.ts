import { PrismaService } from "@main/core/prisma/prisma.service";
import { MainMessages } from "@libs/constants/index";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class TestingController {
	constructor(private readonly prisma: PrismaService) {}

	@MessagePattern(MainMessages.CLEAR_MAIN_DATABASE)
	async clearDatabase() {
		await this.prisma.profile.deleteMany();
		return "clear database";
	}
}
