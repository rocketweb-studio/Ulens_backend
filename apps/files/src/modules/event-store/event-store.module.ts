import { Module } from "@nestjs/common";
import { InboxService } from "@files/modules/event-store/inbox.service";
import { IInboxCommandRepository } from "@files/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@files/modules/event-store/infrastructure/inbox.command.repository";

@Module({
	imports: [],
	providers: [InboxService, { provide: IInboxCommandRepository, useClass: InboxCommandRepository }],
	exports: [InboxService],
})
export class EventStoreModule {}
