import { Injectable } from "@nestjs/common";
import { ILikeCommandRepository } from "@main/modules/like/like.interface";
import { LikeInputDto } from "./dto/like.input.dto";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class LikeService {
	constructor(private readonly likeCommandRepository: ILikeCommandRepository) {}

	async likePostOrComment(dto: LikeInputDto): Promise<void> {
		if (dto.like) {
			const like = await this.likeCommandRepository.findLike(dto);
			if (like) {
				throw new BadRequestRpcException("You already liked this");
			}
			await this.likeCommandRepository.createLike(dto);
		} else {
			const like = await this.likeCommandRepository.findLike(dto);
			if (!like) {
				throw new BadRequestRpcException("You didn't like this");
			}
			await this.likeCommandRepository.deleteLike(dto);
		}
	}
}
