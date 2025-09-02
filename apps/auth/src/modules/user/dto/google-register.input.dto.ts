import { CreateOauthUserDto, SessionMetadataDto } from "@libs/contracts/index";

export class GoogleRegisterInputDto {
	metadata: SessionMetadataDto;
	registerDto: CreateOauthUserDto;
}
