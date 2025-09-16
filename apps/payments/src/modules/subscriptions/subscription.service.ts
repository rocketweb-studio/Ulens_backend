import { Injectable } from "@nestjs/common";
import { ISubscriptionCommandRepository } from "./subscription.interface";
import { RedisService } from "@libs/redis/redis.service";
import { randomUUID } from "crypto";
import { BadRequestRpcException, BaseRpcException } from "@libs/exeption/index";
import { CreateTransactionInternalDto } from "./dto/create-transaction.dto";

// Входные данные из gateway (userId, Idempotency-Key и т.п.)
export class SubscInputDto {
	planCode: string;
	provider: "MOCK" | "STRIPE" | "PAYPAL";
	userId: string;
	idempotencyKey: string;
}

@Injectable()
export class SubscriptionService {
	constructor(
		private readonly subscriptionCommandRepo: ISubscriptionCommandRepository,
		private readonly redisService: RedisService,
	) {}

	/**
	 *  - EX — это секунды, НЕ миллисекунды.
	 *  - Заголовок Idempotency-Key приходит от клиента. Мы добавляем userId в ключ, чтобы он был «пространственно уникален».
	 *  - В RedisInsight ищем по шаблону: payments:idem:sub:create:*  и  payments:lock:idem:sub:create:*
	 * По дефолту Redis использует db: 0
	 */
	async createSubscription(dto: SubscInputDto): Promise<{ transactionId: string; plan: any }> {
		const { idempotencyKey, planCode, provider, userId } = dto;

		// 0) Валидируем план
		const plan = await this.subscriptionCommandRepo.getUniqueSubscription(planCode);
		if (!plan) {
			throw new BadRequestRpcException("Unknown planCode");
		}

		// --------- Формируем ключи Redis (здесь «добавляем»/используем ключи) ---------
		// 		Ключ результата (маппинг idem -> transactionId)
		// 	payments:idem:sub:create:<userId>:<idempotencyKey>  ->  <transactionId>
		//  TTL: 24 часа (EX 86400). Тут мы "кладём" transactionId и потом читаем его при повторах.
		const idemKey = `payments:idem:sub:create:${userId}:${idempotencyKey}`;
		// Ключ лока (защита от параллельных одинаковых запросов)
		const lockKey = `payments:lock:idem:sub:create:${userId}:${idempotencyKey}`;

		// 1) Если уже есть маппинг для этого ключа — !!сразу вернуть тот же transactionId
		const existing = await this.redisService.get(idemKey);
		if (existing) {
			return { transactionId: existing, plan };
		}

		// 2) Берём лок, чтобы не было гонок (SETNX + EXPIRE 30s)
		// SETNX возвращает 1, если ключ создан, и 0, если уже существует
		const locked = await this.redisService.setnx(lockKey, "1"); // 1 | 0
		if (locked !== 1) {
			// Кто-то уже выполняет эту операцию с тем же ключом
			// 409 упадет только если у нас в редисе еще нет такого idemKey, но есть lockKey (супер сложно поймать этот момент времени)
			throw new BaseRpcException(409, "Operation is already in progress");
		}
		await this.redisService.expire(lockKey, 30); // TTL лока 30 секунд

		try {
			// Двойная проверка после лока (вдруг другой поток уже успел записать idem между шагами)
			const again = await this.redisService.get(idemKey);
			if (again) {
				return { transactionId: again, plan };
			}

			// 3) Генерим transactionId и сохраняем маппинг idem → transactionId на 24 часа
			const transactionId = randomUUID();

			// Сначала атомарно пытаемся вставить ключ (SETNX)
			const created = await this.redisService.setnx(idemKey, transactionId);
			if (created !== 1) {
				// Ключ уже существует — читаем существующий transactionId и возвращаем его
				const tx = await this.redisService.get(idemKey);
				if (tx === null) {
					// very rare race: key exists from someone else, but not readable yet
					throw new BaseRpcException(409, "Operation is already in progress");
				}
				return { transactionId: tx, plan };
			}
			// Затем задаём TTL (EXPIRE). EX — секунды!
			await this.redisService.expire(idemKey, 60 * 60 * 24); // 24 часа

			const transaction: CreateTransactionInternalDto = {
				id: transactionId,
				userId: userId,
				amountCents: plan.priceCents,
				provider,
				status: "PENDING",
				currency: plan.currency,
				idempotencyKey,
				correlationId: randomUUID(),
				metadata: { planCode },
			};

			const result = await this.subscriptionCommandRepo.createTransaction(transaction);
			console.log("Transaction result--->", result);
			return { transactionId, plan };
		} finally {
			// 4) можно освободить лок или TTL всё равно истечёт (устанавливали 30 секунд)
			// idemKey не удаляем из редис даже после успешного завершения транзакции. Это наша гарантия, идемпотентности
			// что с фронта не прилетить еще один запрос и будет открыта вторая транзакция. Время жизни idemKey - 24часа
			try {
				// await this.redisService.del(lockKey);
			} catch {}
		}
	}
}
