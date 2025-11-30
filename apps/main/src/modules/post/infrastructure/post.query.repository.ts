import { Injectable } from "@nestjs/common";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { GetUserPostsInputDto } from "@main/modules/post/dto/get-user-posts.input.dto";
import { GetFollowingsPostsQueryDto, LikedItemType, PostDbOutputDto, UserPostsPageDto } from "@libs/contracts/index";
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
		// todo change helper to transform in dto
		const pageSize = this.helpers.clampPageSize(dto.pageSize);
		const baseWhere = { userId: dto.userId, deletedAt: null };
		// 1.Первая страница, если курсор не передан
		if (!dto.endCursorPostId) {
			const [totalCount, rows] = await this.helpers.getFirstPage(baseWhere, pageSize);
			const rowsWithLikesCount = await Promise.all(
				rows.map(async (row) => ({
					...row,
					likeCount: await this.getLikesCount(row.id),
					isLiked: dto.authorizedCurrentUserId ? await this.isLiked(dto.authorizedCurrentUserId, row.id) : false,
				})),
			);
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}

		// 2. Находим курсор (запись, на которой остановились)
		const cursor = await this.helpers.resolveCursor(baseWhere, dto.endCursorPostId);
		// Если курсор невалиден (нет такой записи / чужой пост / уже удалён) — возвращаем как первую страницу
		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage(baseWhere, pageSize);
			const rowsWithLikesCount = await Promise.all(
				rows.map(async (row) => ({
					...row,
					likeCount: await this.getLikesCount(row.id),
					isLiked: dto.authorizedCurrentUserId ? await this.isLiked(dto.authorizedCurrentUserId, row.id) : false,
				})),
			);
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}

		// 3. Получаем "следующую страницу" после курсора
		const [totalCount, rows] = await this.helpers.getPageAfterCursor(baseWhere, cursor, pageSize);
		const rowsWithLikesCount = await Promise.all(
			rows.map(async (row) => ({
				...row,
				likeCount: await this.getLikesCount(row.id),
				isLiked: dto.authorizedCurrentUserId ? await this.isLiked(dto.authorizedCurrentUserId, row.id) : false,
			})),
		);
		return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
	}

	//todo 2 повторяющихся метода для получения постов для админа
	async getAllPostsForAdmin(dto: { endCursorPostId: string; pageSize: number }): Promise<UserPostsPageDto> {
		const { endCursorPostId, pageSize } = dto;

		if (!endCursorPostId) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null }, pageSize);
			const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}
		const cursor = await this.helpers.resolveCursor({ deletedAt: null }, endCursorPostId);

		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null }, pageSize);
			const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}

		const [totalCount, rows] = await this.helpers.getPageAfterCursor({ deletedAt: null }, cursor, pageSize);
		const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
		return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
	}

	async getAllPostsForAdminByUserIds(dto: { endCursorPostId: string; pageSize: number; userIds: string[] }): Promise<UserPostsPageDto> {
		const { endCursorPostId, pageSize, userIds } = dto;

		if (!endCursorPostId) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null, userId: { in: userIds } }, pageSize);
			const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}
		const cursor = await this.helpers.resolveCursor({ deletedAt: null, userId: { in: userIds } }, endCursorPostId);

		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null, userId: { in: userIds } }, pageSize);
			const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}

		const [totalCount, rows] = await this.helpers.getPageAfterCursor({ deletedAt: null, userId: { in: userIds } }, cursor, pageSize);
		const rowsWithLikesCount = await Promise.all(rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: false })));
		return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
	}

	async getFollowingsPosts(followingsIds: string[], query: GetFollowingsPostsQueryDto, authorizedCurrentUserId: string): Promise<UserPostsPageDto> {
		const { endCursorPostId, pageSize } = query;
		if (!endCursorPostId) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null, userId: { in: followingsIds } }, pageSize);
			const rowsWithLikesCount = await Promise.all(
				rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: await this.isLiked(authorizedCurrentUserId, row.id) })),
			);
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}
		const cursor = await this.helpers.resolveCursor({ deletedAt: null, userId: { in: followingsIds } }, endCursorPostId);

		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage({ deletedAt: null, userId: { in: followingsIds } }, pageSize);
			const rowsWithLikesCount = await Promise.all(
				rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: await this.isLiked(authorizedCurrentUserId, row.id) })),
			);
			return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
		}

		const [totalCount, rows] = await this.helpers.getPageAfterCursor({ deletedAt: null, userId: { in: followingsIds } }, cursor, pageSize);
		const rowsWithLikesCount = await Promise.all(
			rows.map(async (row) => ({ ...row, likeCount: await this.getLikesCount(row.id), isLiked: await this.isLiked(authorizedCurrentUserId, row.id) })),
		);
		return this.helpers.buildPage(totalCount, pageSize, rowsWithLikesCount);
	}

	async getPostById(id: string, authorizedCurrentUserId?: string | null): Promise<PostDbOutputDto | null> {
		const post = await this.prisma.post.findUnique({
			where: { id },
		});
		const likeCount = await this.getLikesCount(id);
		const isLiked = authorizedCurrentUserId ? await this.isLiked(authorizedCurrentUserId, id) : false;
		return post ? this._mapToView(post, likeCount, isLiked) : null;
	}

	async getUserPostsCount(userId: string): Promise<number> {
		const count = await this.prisma.post.count({
			where: { userId, deletedAt: null },
		});
		return count;
	}

	async getLatestPosts(pageSize: number, authorizedCurrentUserId?: string | null): Promise<PostDbOutputDto[]> {
		const posts = await this.prisma.post.findMany({
			where: { deletedAt: null },
			orderBy: { createdAt: "desc" },
			take: pageSize,
		});
		const rowsWithLikesCount = await Promise.all(
			posts.map(async (post) => ({
				...post,
				likeCount: await this.getLikesCount(post.id),
				isLiked: authorizedCurrentUserId ? await this.isLiked(authorizedCurrentUserId, post.id) : false,
			})),
		);
		return rowsWithLikesCount.map((row) => this._mapToView(row, row.likeCount, row.isLiked));
	}

	private _mapToView(post: Post, likeCount: number, isLiked: boolean): PostDbOutputDto {
		return {
			id: post.id,
			userId: post.userId,
			description: post.description,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
			likeCount: likeCount,
			isLiked: isLiked,
		};
	}

	private async getLikesCount(id: string): Promise<number> {
		return this.prisma.like.count({
			where: { parentType: LikedItemType.POST, parentId: id },
		});
	}

	private async isLiked(userId: string, id: string): Promise<boolean> {
		const like = await this.prisma.like.findFirst({
			where: { userId, parentType: LikedItemType.POST, parentId: id },
		});
		return !!like;
	}
}
