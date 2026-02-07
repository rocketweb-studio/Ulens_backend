import { LikedItemType } from "@libs/contracts/main-contracts/input/like-post-comment.input.dto";

export class GetLikesByItemIdInputDto {
	likedItemType: LikedItemType;
	likedItemId: string;
}

export class GetLikesByItemIdsInputDto {
	likedItemType: LikedItemType;
	likedItemIds: string[];
}
