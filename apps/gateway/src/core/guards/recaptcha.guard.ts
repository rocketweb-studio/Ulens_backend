// guards/recaptcha.guard.ts
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class RecaptchaGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.body.recaptchaToken;

		if (!token) {
			throw new BadRequestRpcException("reCAPTCHA token is missing", "recaptchaToken");
		}

		const secret = process.env.RECAPTCHA_SECRET_KEY;
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
