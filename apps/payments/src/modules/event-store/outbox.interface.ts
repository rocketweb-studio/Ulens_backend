import { CreateOutboxNotificationEmailEventDto } from "@payments/modules/event-store/dto/create-outbox-notification-email-event.dto";
import { CreateOutBoxTransactionEventDto } from "@payments/modules/event-store/dto/create-outbox-transaction-event.dto";
import { CreateOutboxNotificationRenewalCheckedEventDto } from "@payments/modules/event-store/dto/create-outbox-notification-renewal-event.dto";

export abstract class IOutboxCommandRepository {
	abstract createOutboxTransactionEvent(dto: CreateOutBoxTransactionEventDto): Promise<string>;
	abstract createOutboxNotificationEmailEvent(dto: CreateOutboxNotificationEmailEventDto): Promise<string>;
	abstract createOutboxNotificationRenewalCheckedEvent(dto: CreateOutboxNotificationRenewalCheckedEventDto): Promise<string>;
	abstract findPendingOutboxEvents(chanckSize: number): Promise<any[]>;
	abstract updateOutboxPendingEvent(id: string): Promise<any>;
	abstract updateOutboxPublishedEvent(id: string): Promise<any>;
	abstract updateOutboxFailedEvent(id: string, next: Date): Promise<any>;
}
