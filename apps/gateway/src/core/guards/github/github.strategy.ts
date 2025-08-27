import { CoreEnvConfig } from "@gateway/core/core.config";
import { CreateOauthUserDto } from "@libs/contracts/auth-contracts/input/create-oauth-user.dto";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <used in super>
	constructor(private readonly coreConfig: CoreEnvConfig) {
		super({
			clientID: coreConfig.githubClientId,
			clientSecret: coreConfig.githubClientSecret,
			callbackURL: coreConfig.githubCallbackUrl,
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
