import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { CoreEnvConfig } from "@gateway/core/core.config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <used in super>
	constructor(private readonly coreConfig: CoreEnvConfig) {
		super({
			clientID: coreConfig.googleClientId,
			clientSecret: coreConfig.googleClientSecret,
			callbackURL: coreConfig.googleCallbackUrl,
			scope: ["email", "profile"],
		});
	}

	//  если просто убрать из параметров токены то все упадет
	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		// profile - это объект с данными о пользователе, который мы получаем от гугла
		const user = {
			email: profile.emails[0].value,
			userName: profile.displayName,
			googleUserId: profile.id,
			accessToken, //  accessToken гугла, не наш. оставляем чтобы lefthook не фонил
			refreshToken, //  refreshToken гугла, не наш.  оставляем чтобы lefthook не фонил
		};

		done(null, user);
	}
}
