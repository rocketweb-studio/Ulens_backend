//* вместо passport.js, мы не можем использовать passport для RPC

import { UserService } from "@auth/modules/user/user.service";
import { LoginDto, SessionMetadataDto } from "@libs/contracts/index";
import { UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class CredentialsAuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { loginDto } = context
			.switchToRpc()
			.getData<{ loginDto: LoginDto; metadata: SessionMetadataDto }>();
		const user = await this.userService.validateUser(loginDto);

		if (!user) {
			throw new UnauthorizedRpcException("Invalid email or password");
		}

		const data = context.getArgByIndex(0);
		data.loginDto = user;
		return true;
	}
}
