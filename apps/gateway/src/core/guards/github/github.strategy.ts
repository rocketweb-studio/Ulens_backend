import { CreateOauthUserDto } from "@libs/contracts/auth-contracts/input/create-oauth-user.dto";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
	constructor() {
		super({
			clientID: "Ov23lijbCaMf5jJMhn32",
			clientSecret: "7c68ab25ad9583b90b7df0bafefdcb0b53ab9f20",
			callbackURL: "http://localhost:4000/api/v1/auth/github-callback",
			scope: ["user:email"],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any) {
		const user: CreateOauthUserDto = {
			userName: profile.username,
			email: profile.emails?.[0]?.value,
			providerProfileId: profile.id,
			accessToken, //  accessToken github, не наш. оставляем чтобы lefthook не фонил
			refreshToken, //  refreshToken github, не наш.  оставляем чтобы lefthook не фонил
		};

		return user;
	}
}
