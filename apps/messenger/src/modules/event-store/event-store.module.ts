import { Module } from "@nestjs/common";
import { InboxService } from "@messenger/modules/event-store/inbox.service";
import { IInboxCommandRepository } from "@messenger/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@messenger/modules/event-store/infrastructure/inbox.command.repository";
import { OutboxService } from "@messenger/modules/event-store/outbox.service";
import { IOutboxCommandRepository } from "@messenger/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@messenger/modules/event-store/infrastructure/outbox.command.repository";

@Module({
	imports: [],
	providers: [
		InboxService,
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
		OutboxService,
		{ provide: IOutboxCommandRepository, useClass: OutboxCommandRepository },
	],
	exports: [InboxService, OutboxService],
})
export class EventStoreModule {}
