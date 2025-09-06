import { Injectable } from "@nestjs/common";
import { CreatePostWithUserIdDto } from "./dto/create-post.userId.input.dto";
import { IPostCommandRepository } from "./post.interface";
import { CreatePostOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "./dto/delete-post.input.dto";
import { ForbiddenRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";

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

		if (!post) throw new NotFoundRpcException();

		if (post.userId !== userId) throw new ForbiddenRpcException();

		const result = await this.postCommandRepository.deletePost(postId);
		return result;
	}

	async updatePost(dto: UpdatePostDto): Promise<boolean> {
		const { userId, postId } = dto;

		const post = await this.postCommandRepository.getPostById(postId);

		if (!post) throw new NotFoundRpcException();

		if (post.userId !== userId) throw new ForbiddenRpcException();

		const result = await this.postCommandRepository.updatePost(dto);
		return result;
	}
}
