import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@notifications/core/prisma/generated";

// Сервис для Prisma. Используется для работы с базой данных, инжектируется в модули через DI.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	//? config не переопределяет переменную DATABASE_URL, поэтому не работает. нужно уточнить.
	//   constructor(private config: PrismaConfig) {
	//     super({
	//       datasources: {
	//         db: { url: config.databaseUrl }
	//       }
	//     });
	//   }
	public async onModuleInit() {
		await this.$connect();
	}

	public async onModuleDestroy() {
		await this.$disconnect();
	}
}
