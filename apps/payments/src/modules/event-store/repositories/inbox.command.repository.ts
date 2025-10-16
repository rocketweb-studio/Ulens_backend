import { IInboxCommandRepository } from "@payments/modules/event-store/inbox.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { Prisma } from "@payments/core/prisma/generated/client";
import { CreateInboxEventDto } from "@payments/modules/event-store/dto/create-inbox.dto";
import { UpdateInboxEventDto } from "@payments/modules/event-store/dto/update-inbox.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InboxCommandRepository implements IInboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createInboxMessage(tx: Prisma.TransactionClient, dto: CreateInboxEventDto): Promise<boolean> {
		const ins = await tx.inboxEvent.createMany({
			data: [
				{
					id: dto.id,
					type: dto.type,
					source: dto.source,
					payload: dto.payload,
					status: dto.status,
				},
			],
			skipDuplicates: true,
		});
		if (ins.count === 0) {
			return false; // уже обработали
		}
		return true;
	}

	async createInboxMessageWithoutTransaction(dto: CreateInboxEventDto): Promise<boolean> {
		const ins = await this.prisma.inboxEvent.createMany({
			data: [
				{
					id: dto.id,
					type: dto.type,
					source: dto.source,
					payload: dto.payload,
					status: dto.status,
				},
			],
			skipDuplicates: true,
		});
		if (ins.count === 0) {
			return false; // уже обработали
		}
		return true;
	}

	async updateInboxMessage(tx: Prisma.TransactionClient, dto: UpdateInboxEventDto): Promise<boolean> {
		const upd = await tx.inboxEvent.update({
			where: { id: dto.id },
			data: { status: dto.status, processedAt: new Date() },
		});
		return !!upd;
	}
}
