import { PrismaService } from "@notifications/core/prisma/prisma.service";
import { INotificationCommandRepository } from "../notification.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationCommandRepository implements INotificationCommandRepository {
	constructor(private readonly prisma: PrismaService) {}
}
