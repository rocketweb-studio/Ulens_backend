import { AvatarInputDto } from "./dto/avatar.input.dto";
import { AvatarImagesOutputDto, PostImagesOutputDto, PostImagesOutputForMapDto } from "@libs/contracts/index";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IFilesQueryRepository {
	abstract findAvatarByUserId(userId: string): Promise<AvatarImagesOutputDto>;
	abstract findPostImagesByPostId(postId: string): Promise<PostImagesOutputDto>;
	abstract getAvatarsByUserId(userId: string): Promise<AvatarImagesOutputDto>;
	abstract getImagesByPostIds(postIds: string[]): Promise<PostImagesOutputForMapDto[]>;
	abstract getAvatarsByUserIds(userIds: string[]): Promise<{ userId: string; avatars: AvatarImagesOutputDto }[]>;
}

export abstract class IFilesCommandRepository {
	abstract saveAvatar(data: AvatarInputDto): Promise<string[] | null>;
	abstract savePostImages(data: any): Promise<boolean>;
	abstract deleteAvatarsByUserId(userId: string): Promise<boolean>;
}
