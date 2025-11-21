import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@messenger/modules/event-store/outbox.interface";

@Injectable()
export class OutboxService {
	constructor(private readonly outboxCommandRepository: IOutboxCommandRepository) {}

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
