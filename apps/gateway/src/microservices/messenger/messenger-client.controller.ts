import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessengerClientService } from "./messenger-client.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { MessengerRouterPaths } from "@libs/constants/index";
import { CreateRoomInputDto, MessageOutputDto, PayloadFromRequestDto, RoomOutputDto, UploadImageOutputDto } from "@libs/contracts/index";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagsNames } from "@libs/constants/index";
import { GetRoomsSwagger } from "@gateway/core/decorators/swagger/messenger/get-rooms.decorator";
import { CreateRoomSwagger } from "@gateway/core/decorators/swagger/messenger/create-room.decorator";
import { GetRoomMessagesSwagger } from "@gateway/core/decorators/swagger/messenger/get-room-messages.decorator";
import { UploadMessageImagesSwagger } from "@gateway/core/decorators/swagger/messenger/upload-message-images.decorator";
import { StreamingFileInterceptor } from "@gateway/core/interceptors/streaming-file.interceptor";
import { Request } from "express";

@ApiTags(ApiTagsNames.MESSENGER)
@Controller(MessengerRouterPaths.MESSENGER)
@UseGuards(JwtAccessAuthGuard)
export class MessengerClientController {
	constructor(private readonly messengerClientService: MessengerClientService) {}

	@GetRoomsSwagger()
	@Get(MessengerRouterPaths.ROOMS)
	@HttpCode(HttpStatus.OK)
	async getRooms(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<RoomOutputDto[]> {
		const rooms = await this.messengerClientService.getRooms(user.userId);
		return rooms;
	}

	@CreateRoomSwagger()
	@Post(MessengerRouterPaths.ROOMS)
	@HttpCode(HttpStatus.CREATED)
	async createRoom(
		@ExtractUserFromRequest() user: PayloadFromRequestDto,
		@Body() dto: CreateRoomInputDto,
	): Promise<Omit<RoomOutputDto, "lastMessage" | "roomUser" | "media">> {
		const room = await this.messengerClientService.createRoom(user.userId, dto.targetUserId);
		return room;
	}

	@GetRoomMessagesSwagger()
	@Get(MessengerRouterPaths.MESSAGES)
	@HttpCode(HttpStatus.OK)
	async getRoomMessages(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Param("roomId") roomId: number): Promise<MessageOutputDto[]> {
		const rooms = await this.messengerClientService.getRoomMessages(roomId, user.userId);
		return rooms;
	}

	@UploadMessageImagesSwagger()
	@Post(MessengerRouterPaths.IMAGES)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	@UseInterceptors(StreamingFileInterceptor)
	async uploadMessageImages(@Param("roomId") roomId: number, @Req() req: Request): Promise<UploadImageOutputDto> {
		const result = await this.messengerClientService.uploadMessageImages(roomId, req);
		return result;
	}

	//todo удалять чаты по ТЗ пока не требуется
}
