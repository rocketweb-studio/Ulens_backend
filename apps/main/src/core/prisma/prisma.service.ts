import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./generated";

// Сервис для Prisma. Используется для работы с базой данных, инжектируется в модули через DI.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	public async onModuleInit() {
		await this.$connect();
	}

	public async onModuleDestroy() {
		await this.$disconnect();
	}
}
