import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

// Модуль для Prisma. Импортируется в CoreModule.
@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
