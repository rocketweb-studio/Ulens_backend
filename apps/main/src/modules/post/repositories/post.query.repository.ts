import { Injectable } from "@nestjs/common";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { GetUserPostsInputDto } from "../dto/get-user-posts.input.dto";
import { Prisma } from "@main/core/prisma/generated";
import { UserPostsPageDto } from "@libs/contracts/index";

type Row = { id: string; description: string; createdAt: Date; updatedAt: Date };

const DEFAULT_PAGE_SIZE = 8;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 8;

@Injectable()
export class PrismaPostQueryRepository implements IPostQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Возвращает ленту постов страницами для бесконечного скролла.
	 * - Без endCursorPostId → первая страница
	 * - С endCursorPostId   → следующий чанк ПОСЛЕ указанного поста
	 * Дефолтная сортировка: createdAt desc, id desc.
	 */

	async getUserPosts(dto: GetUserPostsInputDto): Promise<any> {
		const pageSize = this.clampPageSize(dto.pageSize);
		const baseWhere = this.buildBaseWhere(dto.userId);

		// 1.Первая страница, если курсор не передан
		if (!dto.endCursorPostId) {
			const [totalCount, rows] = await this.getFirstPage(baseWhere, pageSize);
			return this.buildPage(totalCount, pageSize, rows);
		}

		// 2. Находим курсор (запись, на которой остановились)
		const cursor = await this.resolveCursor(baseWhere, dto.endCursorPostId);
		// Если курсор невалиден (нет такой записи / чужой пост / уже удалён) — возвращаем как первую страницу
		if (!cursor) {
			const [totalCount, rows] = await this.getFirstPage(baseWhere, pageSize);
			return this.buildPage(totalCount, pageSize, rows);
		}

		// 3. Получаем "следующую страницу" после курсора
		const [totalCount, rows] = await this.getPageAfterCursor(baseWhere, cursor, pageSize);
		return this.buildPage(totalCount, pageSize, rows);
	}

	/* ====== Приватные методы используемые для метода getUserPosts ======*/
	// Возможно в будущем имеет смысл вынести их в отдельный вспомогательный сервис

	/**
	 * Первая страница: считаем общее количество и берём первые n строк.
	 * Отдаём одной транзакцией для логической консистентности totalCount и данных.
	 */
	private async getFirstPage(where: Prisma.PostWhereInput, pageSize: number): Promise<[number, Row[]]> {
		return this.prisma.$transaction([
			this.prisma.post.count({ where }),
			this.prisma.post.findMany({
				where,
				orderBy: this.getOrderBy(),
				take: pageSize,
				select: { id: true, description: true, createdAt: true, updatedAt: true },
			}),
		]);
	}

	/* Возвращаем курсор  или null если не был найден */
	private async resolveCursor(baseWhere: Prisma.PostWhereInput, endCursorPostId: string): Promise<{ createdAt: Date; id: string } | null> {
		const row = await this.prisma.post.findFirst({
			where: { ...baseWhere, id: endCursorPostId },
			select: { id: true, createdAt: true },
		});
		return row ? { id: row.id, createdAt: row.createdAt } : null;
	}

	/**
	 * Следующая "страница" ПОСЛЕ курсора.
	 * Используем compound-cursor (createdAt, id) — требует @@unique([createdAt, id]).
	 * skip: 1 — чтобы не возвращать сам элемент-курсор.
	 */
	private async getPageAfterCursor(where: Prisma.PostWhereInput, cursor: { createdAt: Date; id: string }, pageSize: number): Promise<[number, Row[]]> {
		return this.prisma.$transaction([
			this.prisma.post.count({ where }),
			this.prisma.post.findMany({
				where,
				orderBy: this.getOrderBy(),
				cursor: { createdAt_id: { createdAt: cursor.createdAt, id: cursor.id } },
				skip: 1,
				take: pageSize,
				select: { id: true, description: true, createdAt: true, updatedAt: true },
			}),
		]);
	}

	/* Единая сортировка */
	private getOrderBy(): Prisma.PostOrderByWithRelationInput[] {
		return [{ createdAt: "desc" }, { id: "desc" }];
	}

	/**
	 * Компонуем DTO ответа:
	 * - totalCount — общее число элементов по базовому фильтру (без учёта курсора)
	 * - items      — маппим даты в ISO
	 * - pageInfo   — курсор последнего элемента текущей страницы + флаг "есть ещё"
	 */
	private buildPage(totalCount: number, pageSize: number, rows: Row[]): UserPostsPageDto {
		const endCursor = rows.length ? rows[rows.length - 1].id : undefined;
		return {
			totalCount,
			pageSize,
			items: rows.map((r) => ({
				id: r.id,
				description: r.description,
				createdAt: r.createdAt.toISOString(),
				updatedAt: r.updatedAt.toISOString(),
			})),
			pageInfo: {
				endCursorPostId: endCursor,
				hasNextPage: rows.length === pageSize,
			},
		};
	}

	/* Базовый фильтр: только посты конкретного пользователя и не удалённые. */
	private buildBaseWhere(userId: string): Prisma.PostWhereInput {
		return { userId, deletedAt: null };
	}

	/* Защита на pageSize */
	private clampPageSize(raw?: number): number {
		const v = raw ?? DEFAULT_PAGE_SIZE;
		return Math.min(Math.max(v, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
	}
}
