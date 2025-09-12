import { SessionMetadataDto } from "@libs/contracts/index";
import { UserOutputRepoDto } from "./user-repo.ouptut.dto";

export class LoginInputDto {
	metadata: SessionMetadataDto;
	loginDto: UserOutputRepoDto;
}
