import { Controller, Get, UseGuards, HttpCode, HttpStatus, Req, Res } from "@nestjs/common";
import { ApiTags, ApiExcludeEndpoint } from "@nestjs/swagger";
import { ApiTagsNames, AuthRouterPaths, Oauth2Providers } from "@libs/constants/index";
import { CreateOauthUserDto } from "@libs/contracts/index";
import { CoreEnvConfig, Environments } from "../../../core/core.config";
import { GoogleGuard } from "@gateway/core/guards/google/google.guard";
import { getSessionMetadata } from "@gateway/utils/session-metadata.util";
import { AuthClientService } from "../auth-client.service";
import { Response, Request } from "express";
import { ThrottlerGuard } from "@nestjs/throttler";
import { GoogleOathSwagger } from "@gateway/core/decorators/swagger/auth/google-oauth-registration.decorator";
import { GitHubOathSwagger } from "@gateway/core/decorators/swagger/auth/github-oath-registration.decorator";
import { GithubGuard } from "@gateway/core/guards/github/github.guard";

@ApiTags(ApiTagsNames.OAuth2)
@Controller(AuthRouterPaths.AUTH)
export class AuthClientOAuthController {
	constructor(
		private readonly authClientService: AuthClientService,
		private readonly coreConfig: CoreEnvConfig,
	) {}

	@GoogleOathSwagger()
	@Get(AuthRouterPaths.GOOGLE_LOGIN)
	@UseGuards(ThrottlerGuard)
	@UseGuards(GoogleGuard)
	async googleAuth() {}

	@ApiExcludeEndpoint()
	@Get(AuthRouterPaths.GOOGLE_CALLBACK)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(GoogleGuard)
	async googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
		const user = request.user as CreateOauthUserDto;
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);

		const { refreshToken } = await this.authClientService.registrationOauth2(user, metadata, Oauth2Providers.GOOGLE);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === Environments.PRODUCTION, // secure только в проде, а для тестов false
			sameSite: "lax",
		});

		// согласовать урл с фронтом
		response.redirect(`${this.coreConfig.frontendUrl}`);
	}

	@GitHubOathSwagger()
	@Get(AuthRouterPaths.GITHUB_LOGIN)
	@UseGuards(ThrottlerGuard)
	@UseGuards(GithubGuard)
	async githubAuth() {}

	@ApiExcludeEndpoint()
	@Get(AuthRouterPaths.GITHUB_CALLBACK)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(GithubGuard)
	async githubAuthRedirect(@Req() request: Request, @Res() response: Response) {
		const user = request.user as CreateOauthUserDto;
		const userAgent = request.headers["user-agent"];
		const metadata = getSessionMetadata(request, userAgent);

		const { refreshToken } = await this.authClientService.registrationOauth2(user, metadata, Oauth2Providers.GITHUB);
		response.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === Environments.PRODUCTION, // secure только в проде, а для тестов false
			sameSite: "lax",
		});

		// согласовать урл с фронтом
		response.redirect(`${this.coreConfig.frontendUrl}`);
	}
}
