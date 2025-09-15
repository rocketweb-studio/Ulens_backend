import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Headers, BadRequestException } from "@nestjs/common";
import { ApiTagsNames, PaymentsRouterPaths } from "@libs/constants/index";
import { ApiTags } from "@nestjs/swagger";
import { SubscriptionsClientService } from "./subscriptions-client.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto } from "@libs/contracts/index";

@ApiTags(ApiTagsNames.SUBSCRIPTIONS)
@Controller(PaymentsRouterPaths.SUBSCRIPTIONS)
export class SubscriptionsClientController {
	constructor(private readonly subscriptionsClientService: SubscriptionsClientService) {}

	/**
	 * Заголовок `Idempotency-Key` используем для идемпотентности:
	 * один и тот же ключ для того чтобы повторный запрос не создал дубль, а вернул тот же результат.
	 * Ключ генерируется на фронте (UUID) и передаётся в заголовке запроса.
	 * Заголовки не чувствительны к регистру
	 */

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	async createSubscription(
		@ExtractUserFromRequest() user: PayloadFromRequestDto,
		@Body() dto: { planCode: string; provider: string },
		@Headers("idempotency-key") idempotencyKey?: string,
	): Promise<any> {
		if (!idempotencyKey) {
			throw new BadRequestException("Missing Idempotency-Key header");
		}
		const result = await this.subscriptionsClientService.createSubscription({
			userId: user.userId,
			idempotencyKey,
			planCode: dto.planCode,
			provider: dto.provider,
		});
		return result;
	}
}
