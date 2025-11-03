import { Module } from "@nestjs/common";
import { OutboxService } from "@main/modules/event-store/outbox.service";
import { IOutboxCommandRepository } from "@main/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@main/modules/event-store/repositories/outbox.command.repository";
import { InboxService } from "@main/modules/event-store/inbox.service";
import { IInboxCommandRepository } from "@main/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@main/modules/event-store/repositories/inbox.command.repository";

@Module({
	imports: [],
	providers: [
		OutboxService,
		{ provide: IOutboxCommandRepository, useClass: OutboxCommandRepository },
		InboxService,
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
	],
	exports: [OutboxService, InboxService],
})
export class EventStoreModule {}
