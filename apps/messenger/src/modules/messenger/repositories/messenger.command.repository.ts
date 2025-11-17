import { PrismaService } from "@messenger/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IMessengerCommandRepository } from "../messenger.interface";

@Injectable()
export class MessengerCommandRepository implements IMessengerCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	// async softDeleteUserNotifications(userId: string): Promise<void> {
	// 	await this.prisma.message.updateMany({
	// 		where: { userId },
	// 		data: { deletedAt: new Date() },
	// 	});
	// }

	// async deleteDeletedNotifications(): Promise<void> {
	// 	const { count } = await this.prisma.message.deleteMany({
	// 		where: { deletedAt: { not: null } },
	// 	});
	// 	console.log(`Deleted deleted notifications: [${count}]`);
	// }
}
