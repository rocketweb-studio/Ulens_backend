import { Injectable } from "@nestjs/common";
import { CreatePostWithUserIdDto } from "@main/modules/post/dto/create-post.userId.input.dto";
import { IPostCommandRepository } from "@main/modules/post/post.interface";
import { CreatePostOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "@main/modules/post/dto/delete-post.input.dto";
import { ForbiddenRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PostService {
	constructor(private readonly postCommandRepository: IPostCommandRepository) {}

	async createPost(dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto> {
		const result = await this.postCommandRepository.createPost(dto);
		return result;
	}

	async deletePost(dto: DeletePostDto): Promise<boolean> {
		const { userId, postId } = dto;

		const post = await this.postCommandRepository.getPostById(postId);

		if (!post) throw new NotFoundRpcException("Post not found");

		if (post.userId !== userId) throw new ForbiddenRpcException();

		const result = await this.postCommandRepository.deletePost(postId);
		return result;
	}

	async softDeleteUserPosts(userId: string): Promise<boolean> {
		const result = await this.postCommandRepository.softDeleteUserPosts(userId);
		return result;
	}

	async updatePost(dto: UpdatePostDto): Promise<boolean> {
		const { userId, postId } = dto;

		const post = await this.postCommandRepository.getPostById(postId);

		if (!post) throw new NotFoundRpcException("Post not found");

		if (post.userId !== userId) throw new ForbiddenRpcException();

		const result = await this.postCommandRepository.updatePost(dto);
		return result;
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeletedPosts() {
		await this.postCommandRepository.deleteDeletedPosts();
	}
}
