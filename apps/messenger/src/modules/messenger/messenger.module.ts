import { Module } from "@nestjs/common";
import { MessengerController } from "@messenger/modules/messenger/messenger.controller";
import { MessengerService } from "@messenger/modules/messenger/messenger.service";
import { IMessengerCommandRepository } from "@messenger/modules/messenger/messenger.interface";
import { MessengerCommandRepository } from "@messenger/modules/messenger/repositories/messenger.command.repository";
import { IMessengerQueryRepository } from "@messenger/modules/messenger/messenger.interface";
import { MessengerQueryRepository } from "@messenger/modules/messenger/repositories/messenger.query.repository";

@Module({
	controllers: [MessengerController],
	providers: [
		MessengerService,
		{ provide: IMessengerCommandRepository, useClass: MessengerCommandRepository },
		{ provide: IMessengerQueryRepository, useClass: MessengerQueryRepository },
	],
	exports: [MessengerService],
})
export class MessengerModule {}
