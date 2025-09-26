// src/modules/post/repositories/post.query.helpers.ts
import { Prisma } from "@main/core/prisma/generated";
import { UserPostsPageDto } from "@libs/contracts/index";
import { PrismaService } from "@main/core/prisma/prisma.service";

export type Row = { id: string; description: string; createdAt: Date; updatedAt: Date };

export const DEFAULT_PAGE_SIZE = 10;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 10;

export class PostQueryHelper {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Первая страница: считаем общее количество и берём первые n строк.
	 * Отдаём одной транзакцией для логической консистентности totalCount и данных.
	 */
	async getFirstPage(where: Prisma.PostWhereInput, pageSize: number): Promise<[number, Row[]]> {
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
	async resolveCursor(baseWhere: Prisma.PostWhereInput, endCursorPostId: string): Promise<{ createdAt: Date; id: string } | null> {
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
	async getPageAfterCursor(where: Prisma.PostWhereInput, cursor: { createdAt: Date; id: string }, pageSize: number): Promise<[number, Row[]]> {
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
	getOrderBy(): Prisma.PostOrderByWithRelationInput[] {
		return [{ createdAt: "desc" }, { id: "desc" }];
	}

	/**
	 * Компонуем DTO ответа:
	 * - totalCount — общее число элементов по базовому фильтру (без учёта курсора)
	 * - items      — маппим даты в ISO
	 * - pageInfo   — курсор последнего элемента текущей страницы + флаг "есть ещё"
	 */
	buildPage(totalCount: number, pageSize: number, rows: Row[], userId: string): UserPostsPageDto {
		const endCursor = rows.length ? rows[rows.length - 1].id : undefined;
		return {
			totalCount,
			pageSize,
			items: rows.map((r) => ({
				id: r.id,
				userId,
				description: r.description,
				createdAt: r.createdAt,
				updatedAt: r.updatedAt,
			})),
			pageInfo: {
				endCursorPostId: endCursor,
				hasNextPage: rows.length === pageSize,
			},
		};
	}

	/* Базовый фильтр: только посты конкретного пользователя и не удалённые. */
	buildBaseWhere(userId: string): Prisma.PostWhereInput {
		return { userId, deletedAt: null };
	}

	/* Защита на pageSize */
	clampPageSize(raw?: number): number {
		const v = raw ?? DEFAULT_PAGE_SIZE;
		console.log(v);
		return Math.min(Math.max(v, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
	}
}
