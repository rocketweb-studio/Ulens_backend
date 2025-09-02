// guards/recaptcha.guard.ts
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CoreEnvConfig } from "../core.config";

@Injectable()
export class RecaptchaGuard implements CanActivate {
	constructor(private readonly coreConfig: CoreEnvConfig) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.body.recaptchaToken;

		if (!token) {
			throw new BadRequestRpcException("reCAPTCHA token is missing", "recaptchaToken");
		}

		// добавили для того чтобы тестировать положительный сценарий recoveryPassword
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
