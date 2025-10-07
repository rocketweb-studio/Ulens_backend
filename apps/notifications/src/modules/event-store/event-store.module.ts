import { Module } from "@nestjs/common";
import { InboxService } from "@notifications/modules/event-store/inbox.service";
import { IInboxCommandRepository } from "@notifications/modules/event-store/inbox.interface";
import { InboxCommandRepository } from "@notifications/modules/event-store/repositories/inbox.command.repository";

@Module({
	imports: [],
	providers: [InboxService, { provide: IInboxCommandRepository, useClass: InboxCommandRepository }],
	exports: [InboxService],
})
export class EventStoreModule {}
