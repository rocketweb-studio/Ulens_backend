import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor(private readonly configService: ConfigService<any, true>) {
		super({
			clientID: "1047538403398-bdips6r68tutofccq9on0okscmja03ta.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:4000/api/v1/auth/google-callback",
			scope: ["email", "profile"],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		// profile - это объект с данными о пользователе, который мы получаем от гугла
		const user = {
			email: profile.emails[0].value,
			userName: profile.displayName,
			id: profile.id,
			accessToken, // todo accessToken гугла, не наш
		};

		// const {refreshToken } = await this.authClientService.registrationGoogle(user);

		console.log(user);

		// todo дальше обработать юзера и вернуть его в контроллер

		done(null, user);
	}
}
