import { Injectable } from "@nestjs/common";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { GetUserPostsInputDto } from "../dto/get-user-posts.input.dto";
import { PostDbOutputDto, UserPostsPageDto } from "@libs/contracts/index";
import { PostQueryHelper } from "@main/utils/post.query.repo.helper";
import { Post } from "@main/core/prisma/generated";

@Injectable()
export class PrismaPostQueryRepository implements IPostQueryRepository {
	private readonly helpers: PostQueryHelper;

	constructor(private readonly prisma: PrismaService) {
		this.helpers = new PostQueryHelper(prisma);
	}

	/**
	 * Возвращает ленту постов страницами для бесконечного скролла.
	 * - Без endCursorPostId → первая страница
	 * - С endCursorPostId   → следующий чанк ПОСЛЕ указанного поста
	 * Дефолтная сортировка: createdAt desc, id desc.
	 */

	async getUserPosts(dto: GetUserPostsInputDto): Promise<UserPostsPageDto> {
		const pageSize = this.helpers.clampPageSize(dto.pageSize);
		const baseWhere = this.helpers.buildBaseWhere(dto.userId);

		// 1.Первая страница, если курсор не передан
		if (!dto.endCursorPostId) {
			const [totalCount, rows] = await this.helpers.getFirstPage(baseWhere, pageSize);
			return this.helpers.buildPage(totalCount, pageSize, rows);
		}

		// 2. Находим курсор (запись, на которой остановились)
		const cursor = await this.helpers.resolveCursor(baseWhere, dto.endCursorPostId);
		// Если курсор невалиден (нет такой записи / чужой пост / уже удалён) — возвращаем как первую страницу
		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage(baseWhere, pageSize);
			return this.helpers.buildPage(totalCount, pageSize, rows);
		}

		// 3. Получаем "следующую страницу" после курсора
		const [totalCount, rows] = await this.helpers.getPageAfterCursor(baseWhere, cursor, pageSize);
		return this.helpers.buildPage(totalCount, pageSize, rows);
	}

	async getPostById(id: string): Promise<PostDbOutputDto | null> {
		const post = await this.prisma.post.findUnique({
			where: { id },
		});
		return post ? this._mapToView(post) : null;
	}

	private _mapToView(post: Post): PostDbOutputDto {
		return {
			id: post.id,
			userId: post.userId,
			description: post.description,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
		};
	}
}
