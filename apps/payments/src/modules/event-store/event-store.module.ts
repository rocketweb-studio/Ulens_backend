import { Module } from "@nestjs/common";
import { IOutboxCommandRepository } from "@payments/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@payments/modules/event-store/repositories/outbox.command.repository";
import { PlanModule } from "@payments/modules/plan/plan.module";
import { OutboxService } from "@payments/modules/event-store/outbox.service";
import { InboxCommandRepository } from "@payments/modules/event-store/repositories/inbox.command.repository";
import { IInboxCommandRepository } from "@payments/modules/event-store/inbox.interface";

@Module({
	imports: [PlanModule],
	providers: [
		OutboxService,
		{ provide: IOutboxCommandRepository, useClass: OutboxCommandRepository },
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
	],
	exports: [OutboxService, { provide: IInboxCommandRepository, useClass: InboxCommandRepository }],
})
export class EventStoreModule {}
