import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@main/modules/event-store/outbox.interface";
import { CreatePostDbOutputDto } from "@main/modules/post/dto/create-post-db.output.dto";

@Injectable()
export class OutboxService {
	constructor(private readonly outboxCommandRepository: IOutboxCommandRepository) {}

	async createOutboxPostEvent(dto: CreatePostDbOutputDto): Promise<string> {
		return this.outboxCommandRepository.createOutboxPostEvent(dto);
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
