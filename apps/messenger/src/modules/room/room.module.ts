import { Module } from "@nestjs/common";
import { RoomController } from "@messenger/modules/room/room.controller";
import { RoomService } from "@messenger/modules/room/room.service";
import { RoomCommandRepository } from "@messenger/modules/room/repositories/room.command.repository";
import { IRoomCommandRepository, IRoomQueryRepository } from "@messenger/modules/room/room.interface";
import { RoomQueryRepository } from "@messenger/modules/room/repositories/room.query.repository";

@Module({
	controllers: [RoomController],
	providers: [
		RoomService,
		{ provide: IRoomCommandRepository, useClass: RoomCommandRepository },
		{ provide: IRoomQueryRepository, useClass: RoomQueryRepository },
	],
	exports: [RoomService],
})
export class RoomModule {}
