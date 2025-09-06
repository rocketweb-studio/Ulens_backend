import { AvatarInputDto } from "./dto/avatar.input.dto";
import { ImageOutputDto, PostImagesOutputDto } from "@libs/contracts/index";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IFilesQueryRepository {
	abstract findAvatarByUserId(userId: string): Promise<ImageOutputDto[]>;
	abstract findPostImagesByPostId(postId: string): Promise<ImageOutputDto[]>;
	abstract getAvatarUrlByUserId(userId: string): Promise<{ url: string } | null>;
	abstract getImagesByPostIds(postIds: string[]): Promise<PostImagesOutputDto[]>;
}

export abstract class IFilesCommandRepository {
	abstract saveAvatar(data: AvatarInputDto): Promise<string[] | null>;
	abstract savePostImages(data: any): Promise<boolean>;
}
