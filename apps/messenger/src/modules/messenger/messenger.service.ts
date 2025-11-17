import { Injectable } from "@nestjs/common";
import { IMessengerCommandRepository } from "./messenger.interface";

@Injectable()
export class MessengerService {
	constructor(private readonly messengerCommandRepository: IMessengerCommandRepository) {}

	// async softDeleteUserNotifications(userId: string): Promise<void> {
	// 	await this.messengerCommandRepository.softDeleteUserNotifications(userId);
	// }

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	// async deleteDeletedNotifications() {
	// 	await this.messengerCommandRepository.deleteDeletedNotifications();
	// }
}
