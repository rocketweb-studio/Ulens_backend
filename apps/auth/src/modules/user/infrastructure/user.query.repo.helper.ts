// src/modules/post/repositories/post.query.helpers.ts
import { Prisma } from "@auth/core/prisma/generated";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { SearchUsersOutputDto } from "@libs/contracts/index";
import { Injectable } from "@nestjs/common";

export type Row = { id: string; userName: string | null; createdAt: Date; updatedAt: Date; userId: string };

@Injectable()
export class UserQueryHelper {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Первая страница: считаем общее количество и берём первые n строк.
	 * Отдаём одной транзакцией для логической консистентности totalCount и данных.
	 */
	async getFirstPage(where: Prisma.ProfileWhereInput, pageSize: number): Promise<[number, any[]]> {
		return this.prisma.$transaction([
			this.prisma.profile.count({ where }),
			this.prisma.profile.findMany({
				where,
				orderBy: this.getOrderBy(),
				take: pageSize,
			}),
		]);
	}

	/* Возвращаем курсор  или null если не был найден */
	async resolveCursor(baseWhere: Prisma.ProfileWhereInput, endCursorUserId: string): Promise<{ createdAt: Date; id: string } | null> {
		const row = await this.prisma.profile.findFirst({
			where: { ...baseWhere, userId: endCursorUserId },
		});
		return row ? { id: row.userId, createdAt: row.createdAt } : null;
	}

	/**
	 * Следующая "страница" ПОСЛЕ курсора.
	 * Используем compound-cursor (createdAt, id) — требует @@unique([createdAt, id]).
	 * skip: 1 — чтобы не возвращать сам элемент-курсор.
	 */
	async getPageAfterCursor(where: Prisma.ProfileWhereInput, cursor: { createdAt: Date; id: string }, pageSize: number): Promise<[number, any[]]> {
		return this.prisma.$transaction([
			this.prisma.profile.count({ where }),
			this.prisma.profile.findMany({
				where,
				orderBy: this.getOrderBy(),
				cursor: { createdAt: cursor.createdAt, userId: cursor.id },
				skip: 1,
				take: pageSize,
			}),
		]);
	}

	/* Единая сортировка */
	getOrderBy(): Prisma.UserOrderByWithRelationInput[] {
		return [{ createdAt: "desc" }, { id: "desc" }];
	}

	/**
	 * Компонуем DTO ответа:
	 * - totalCount — общее число элементов по базовому фильтру (без учёта курсора)
	 * - items      — маппим даты в ISO
	 * - pageInfo   — курсор последнего элемента текущей страницы + флаг "есть ещё"
	 */
	buildPage(totalCount: number, pageSize: number, rows: any[]): SearchUsersOutputDto {
		const endCursor = rows.length ? rows[rows.length - 1].userId : undefined;
		return {
			totalCount,
			pageSize,
			items: rows.map((r) => ({
				id: r.userId,
				userName: r.userName,
				firstName: r.firstName,
				lastName: r.lastName,
				city: r.city,
				country: r.country,
				dateOfBirth: r.dateOfBirth,
				aboutMe: r.aboutMe,
				createdAt: r.createdAt,
			})),
			pageInfo: {
				endCursorUserId: endCursor,
				hasNextPage: rows.length === pageSize,
			},
		};
	}
}
