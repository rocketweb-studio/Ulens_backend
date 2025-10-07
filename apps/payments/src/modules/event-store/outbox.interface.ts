import { CreateOutBoxNotificationEventDto } from "@payments/modules/event-store/dto/create-outbox-notification-event.dto";
import { CreateOutBoxTransactionEventDto } from "@payments/modules/event-store/dto/create-outbox-transaction-event.dto";

export abstract class IOutboxCommandRepository {
	abstract createOutboxTransactionEvent(dto: CreateOutBoxTransactionEventDto): Promise<string>;
	abstract createOutboxNotificationEvent(dto: CreateOutBoxNotificationEventDto): Promise<string>;
	abstract findPendingOutboxEvents(chanckSize: number): Promise<any[]>;
	abstract updateOutboxPendingEvent(id: string): Promise<any>;
	abstract updateOutboxPublishedEvent(id: string): Promise<any>;
	abstract updateOutboxFailedEvent(id: string, next: Date): Promise<any>;
}
