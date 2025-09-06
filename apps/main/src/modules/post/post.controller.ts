import { Controller } from "@nestjs/common";
import { PostService } from "./post.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MainMessages } from "@libs/constants/index";
import { CreatePostWithUserIdDto } from "./dto/create-post.userId.input.dto";
import { CreatePostOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "./dto/delete-post.input.dto";
import { GetUserPostsInputDto } from "./dto/get-user-posts.input.dto";
import { IPostQueryRepository } from "./post.interface";
import { UserPostsPageDto } from "@libs/contracts/index";

@Controller()
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly postQueryRepository: IPostQueryRepository,
	) {}

	@MessagePattern({ cmd: MainMessages.CREATE_POST })
	async createPost(@Payload() dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto> {
		return this.postService.createPost(dto);
	}

	@MessagePattern({ cmd: MainMessages.DELETE_POST })
	async deletePost(@Payload() dto: DeletePostDto): Promise<boolean> {
		return this.postService.deletePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.UPDATE_POST })
	async updatePost(@Payload() dto: UpdatePostDto): Promise<boolean> {
		return this.postService.updatePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS })
	async getUserPosts(@Payload() dto: GetUserPostsInputDto): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getUserPosts(dto);
	}
}
