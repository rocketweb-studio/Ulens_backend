import { PayloadFromRequestDto } from "@libs/contracts/index";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractUserFromRequest = createParamDecorator((_: unknown, context: ExecutionContext): PayloadFromRequestDto => {
	const request = context.switchToHttp().getRequest();

	const user = request.user;

	if (!user) {
		throw new Error("There is no user in the request object!");
	}

	return user;
});
