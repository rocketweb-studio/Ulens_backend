import { Module } from "@nestjs/common";
import { InboxService } from "@notifications/modules/event-store/inbox.service";
import { IInboxCommandRepository } from "@notifications/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@notifications/modules/event-store/infrastructure/inbox.command.repository";
import { OutboxService } from "@notifications/modules/event-store/outbox.service";
import { IOutboxCommandRepository } from "@notifications/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@notifications/modules/event-store/infrastructure/outbox.command.repository";
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
