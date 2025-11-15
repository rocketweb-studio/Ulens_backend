import { FollowType } from "@libs/constants/auth.constants";

export class CreateOutboxFollowEventDto {
	followingId: string;
	followingUserName: string;
	followType: FollowType;
}
