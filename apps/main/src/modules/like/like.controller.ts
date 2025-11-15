import { Controller } from "@nestjs/common";
import { MainMessages } from "@libs/constants/main-messages";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetLikesByItemIdInputDto, GetLikesByItemIdsInputDto } from "./dto/get-likes.input.dto";
import { ILikeQueryRepository } from "./like.interface";

@Controller()
export class LikeController {
	constructor(private readonly likeQueryRepository: ILikeQueryRepository) {}

	@MessagePattern({ cmd: MainMessages.GET_LIKES_BY_ITEM_ID })
	async getLikesByItemId(@Payload() dto: GetLikesByItemIdInputDto): Promise<{ userId: string }[]> {
		return await this.likeQueryRepository.getLikesByItemId(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_LIKES_BY_ITEM_IDS })
	async getLikesByItemIds(@Payload() dto: GetLikesByItemIdsInputDto): Promise<{ postId: string; users: string[] }[]> {
		return await this.likeQueryRepository.getLikesByItemIds(dto);
	}
}
