import { AvatarInputDto } from "./dto/avatar.input.dto";
import { ImageOutputDto } from "@libs/contracts/index";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IFilesQueryRepository {
	abstract findAvatarByUserId(userId: string): Promise<ImageOutputDto[]>;
	abstract findPostImagesByPostId(postId: string): Promise<ImageOutputDto[]>;
}

export abstract class IFilesCommandRepository {
	abstract saveAvatar(data: AvatarInputDto): Promise<string[] | null>;
	abstract savePostImages(data: any): Promise<boolean>;
}
