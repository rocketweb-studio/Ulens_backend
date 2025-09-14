import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { TransactionOutputDto } from "@libs/contracts/index";

export const GetTransactionsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get transactions" }),
		ApiBearerAuth(),
		ApiOkResponse({ description: "Transactions were successfully received", type: [TransactionOutputDto] }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
	];

	return applyDecorators(...decorators);
};
