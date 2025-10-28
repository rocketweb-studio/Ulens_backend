import { Module } from "@nestjs/common";
import { OutboxService } from "@main/modules/event-store/outbox.service";
import { IOutboxCommandRepository } from "@main/modules/event-store/outbox.interface";
import { OutboxCommandRepository } from "@main/modules/event-store/repositories/outbox.command.repository";

@Module({
	imports: [],
	providers: [OutboxService, { provide: IOutboxCommandRepository, useClass: OutboxCommandRepository }],
	exports: [OutboxService],
})
export class EventStoreModule {}
