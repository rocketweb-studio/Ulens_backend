import { ProfileInputDto } from "@libs/contracts/index";
import { OmitType } from "@nestjs/mapped-types";

export class ProfileUpdateInputDto extends OmitType(ProfileInputDto, ["dateOfBirth"]) {
	dateOfBirth: string | null;
}
