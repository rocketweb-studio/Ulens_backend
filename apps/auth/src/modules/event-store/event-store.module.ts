import { Module } from "@nestjs/common";
import { OutboxService } from "@auth/modules/event-store/outbox.service";
import { IOutboxCommandRepository } from "@auth/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@auth/modules/event-store/infrastructure/outbox.command.repository";
import { IInboxCommandRepository } from "@auth/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@auth/modules/event-store/infrastructure/inbox.command.repository";

@Module({
	imports: [],
	providers: [
		OutboxService,
		{ provide: IOutboxCommandRepository, useClass: OutboxCommandRepository },
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
	],
	exports: [
		OutboxService,
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
		{ provide: IOutboxCommandRepository, useClass: OutboxCommandRepository },
	],
})
export class EventStoreModule {}
