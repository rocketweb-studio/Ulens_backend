import { Injectable } from "@nestjs/common";
import { IPostCommandRepository } from "@main/modules/post/post.interface";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { CreatePostWithUserIdDto } from "@main/modules/post/dto/create-post.userId.input.dto";
import { CreatePostOutputDto, PostDbOutputDto, UpdatePostDto } from "@libs/contracts/index";

@Injectable()
export class PrismaPostCommandRepository implements IPostCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPost({ userId, description }: CreatePostWithUserIdDto): Promise<CreatePostOutputDto> {
		const postId = await this.prisma.post.create({
			data: { userId, description },
			select: { id: true },
		});
		return postId;
	}

	async getPostById(id: string): Promise<PostDbOutputDto | null> {
		const row = await this.prisma.post.findFirst({
			where: { id, deletedAt: null },
			select: { id: true, userId: true, description: true, createdAt: true, updatedAt: true },
		});
		return row;
	}

	async deletePost(id: string): Promise<boolean> {
		const { count } = await this.prisma.post.updateMany({
			where: { id, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return count === 1;
	}

	async updatePost(dto: UpdatePostDto): Promise<boolean> {
		const { postId: id, description } = dto;
		const { count } = await this.prisma.post.updateMany({
			where: { id, deletedAt: null },
			data: { description },
		});
		return count === 1;
	}

	async deleteDeletedPosts(): Promise<void> {
		const { count } = await this.prisma.post.deleteMany({
			where: { deletedAt: { not: null, lt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
		});
		console.log(`Deleted deleted posts: [${count}]`);
	}

	async softDeleteUserPosts(userId: string): Promise<boolean> {
		const { count } = await this.prisma.post.updateMany({
			where: { userId, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return count === 1;
	}
}
