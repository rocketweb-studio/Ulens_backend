// guards/recaptcha.guard.ts
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CoreEnvConfig } from "../core.config";
import { AuthClientService } from "@gateway/microservices/auth/auth-client.service";

@Injectable()
export class RecaptchaGuard implements CanActivate {
	constructor(
		private readonly coreConfig: CoreEnvConfig,
		private readonly authClientService: AuthClientService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.body.recaptchaToken;
		const email = req.body.email;

		const user = await this.authClientService.getUserConfirmation(email);
		if (!user.confirmationCodeConfirmed) {
			throw new BadRequestRpcException("User is not confirmed");
		}

		if (!token) {
			throw new BadRequestRpcException("reCAPTCHA token is missing", "recaptchaToken");
		}

		// добавили для того чтобы тестировать положительный сценарий recoveryPassword
		// todo попробовать замокать в тестах
		if (token === "TEST_RECAPTCHA") {
			return true;
		}

		const secret = this.coreConfig.recaptchaSecretKey;
		const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

		const response = await fetch(verifyUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `secret=${secret}&response=${token}`,
		});

		const data = await response.json();

		if (!data.success) {
			throw new BadRequestRpcException("reCAPTCHA token is missing", "recaptchaToken");
		}

		return true;
	}
}
