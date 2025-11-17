import { Controller } from "@nestjs/common";
import { IMessengerQueryRepository } from "@messenger/modules/messenger/messenger.interface";
import { MessengerService } from "@messenger/modules/messenger/messenger.service";

@Controller()
export class MessengerController {
	constructor(
		private readonly messengerQueryRepository: IMessengerQueryRepository,
		private readonly messengerService: MessengerService,
	) {}
}
