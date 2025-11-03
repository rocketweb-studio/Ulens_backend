import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@notifications/modules/event-store/outbox.interface";
import { CreateOutboxToGatewayDto, CreateOutboxToPaymentsDto } from "@notifications/modules/event-store/dto/create-outbox.dto";

@Injectable()
export class OutboxService {
	constructor(private readonly outboxCommandRepository: IOutboxCommandRepository) {}

	async createOutboxNotificationToGatewayEvent(dto: CreateOutboxToGatewayDto): Promise<string> {
		return this.outboxCommandRepository.createOutboxNotificationToGatewayEvent(dto);
	}

	async createOutboxNotificationToPaymentsEvent(dto: CreateOutboxToPaymentsDto): Promise<string> {
		return this.outboxCommandRepository.createOutboxNotificationToPaymentsEvent(dto);
	}

	async findPendingOutboxEvents(chanckSize = 50): Promise<any[]> {
		return this.outboxCommandRepository.findPendingOutboxEvents(chanckSize);
	}

	async updateOutboxPendingEvent(id: string): Promise<any> {
		return this.outboxCommandRepository.updateOutboxPendingEvent(id);
	}

	async updateOutboxPublishedEvent(id: string, publishedAt: Date): Promise<any> {
		return this.outboxCommandRepository.updateOutboxPublishedEvent(id, publishedAt);
	}

	async updateOutboxFailedEvent(id: string, next: Date): Promise<any> {
		return this.outboxCommandRepository.updateOutboxFailedEvent(id, next);
	}
}
