import { BaseUserView } from "../output/base-user-view-dto";

export class RegistrationResultDto {
  user: BaseUserView;
  confirmationCode: string;
}