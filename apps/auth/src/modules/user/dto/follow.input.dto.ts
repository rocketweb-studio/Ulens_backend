import { FollowType } from "@libs/constants/index";

export class FollowInputDto {
	currentUserId: string;
	userId: string;
	followType: FollowType;
}
