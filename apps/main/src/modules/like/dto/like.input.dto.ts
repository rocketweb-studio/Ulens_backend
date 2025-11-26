import { LikePostOrCommentInputDto } from "@libs/contracts/index";

export class LikeInputDto extends LikePostOrCommentInputDto {
	userId: string;
}
