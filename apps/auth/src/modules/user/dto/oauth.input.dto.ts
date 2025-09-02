import { Oauth2Providers } from "@libs/constants/auth-messages";
import { CreateOauthUserDto } from "@libs/contracts/auth-contracts/input/create-oauth-user.dto";

export class OauthInputDto {
	registerDto: CreateOauthUserDto;
	metadata: any;
	provider: Oauth2Providers;
}
