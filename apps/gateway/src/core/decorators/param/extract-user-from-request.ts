import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractUserFromRequest = createParamDecorator((data: unknown, context: ExecutionContext): any => {
	const request = context.switchToHttp().getRequest();

	const user = request.user;

	if (!user) {
		throw new Error("There is no user in the request object!");
	}

	return user;
});
