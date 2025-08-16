import { BaseUserView } from "./base-user-view-dto";

export class RegistrationResultView {
  user: BaseUserView;
  confirmationCode: string;
}