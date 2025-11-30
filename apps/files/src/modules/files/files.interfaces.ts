import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { AvatarImagesOutputDto, MessageAudioOutputDto, MessageImgDto, PostImagesOutputDto, PostImagesOutputForMapDto } from "@libs/contracts/index";
import { FileVersionInputDto } from "./dto/file-version.input.dto";

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
	abstract getFilesByIds(fileIds: string[]): Promise<MessageImgDto[]>;
	abstract getMediaByMessageIds(messageIds: number[]): Promise<(MessageImgDto | MessageAudioOutputDto)[]>;
}

export abstract class IFilesCommandRepository {
	abstract saveAvatar(data: AvatarInputDto): Promise<string[] | null>;
	abstract savePostImages(data: any): Promise<boolean>;
	abstract deleteAvatarsByUserId(userId: string): Promise<boolean>;
	abstract deleteDeletedFiles(): Promise<void>;
	abstract softDeleteUserFiles(userId: string): Promise<void>;
	abstract saveMessageImages(data: { roomId: number; versions: FileVersionInputDto[] }): Promise<string[]>;
	abstract updateMessageImages(messageId: number, imageIds: string[]): Promise<boolean>;
	abstract saveMessageAudio(data: { roomId: number; url: string }): Promise<MessageAudioOutputDto>;
	abstract updateMessageAudio(messageId: number, audioId: string): Promise<boolean>;
}
