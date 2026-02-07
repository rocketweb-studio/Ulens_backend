import { GetLikesByItemIdInputDto, GetLikesByItemIdsInputDto } from "./dto/get-likes.input.dto";
import { LikeInputDto } from "./dto/like.input.dto";

export abstract class ILikeCommandRepository {
	abstract createLike(dto: LikeInputDto): Promise<boolean>;
	abstract deleteLike(dto: LikeInputDto): Promise<boolean>;
	abstract findLike(dto: LikeInputDto): Promise<boolean>;
}

export abstract class ILikeQueryRepository {
	abstract getLikesByItemId(dto: GetLikesByItemIdInputDto): Promise<{ userId: string }[]>;
	abstract getLikesByItemIds(dto: GetLikesByItemIdsInputDto): Promise<{ postId: string; users: string[] }[]>;
}
