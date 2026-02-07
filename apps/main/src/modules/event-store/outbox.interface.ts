import { CreateOutboxCommentEventDto } from "./dto/create-outbox-comment.dto";

export abstract class IOutboxCommandRepository {
	abstract createOutboxCommentEvent(tx: any, dto: CreateOutboxCommentEventDto): Promise<string>;
	abstract findPendingOutboxEvents(chanckSize: number): Promise<any[]>;
	abstract updateOutboxPendingEvent(id: string): Promise<any>;
	abstract updateOutboxPublishedEvent(id: string, publishedAt: Date): Promise<any>;
	abstract updateOutboxFailedEvent(id: string, next: Date): Promise<any>;
}
