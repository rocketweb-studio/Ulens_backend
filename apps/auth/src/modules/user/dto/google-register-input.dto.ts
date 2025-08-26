import { CreateGoogleUserDto, SessionMetadataDto } from "@libs/contracts/index";

export class GoogleRegisterInputDto {
	metadata: SessionMetadataDto;
	registerDto: CreateGoogleUserDto;
}
