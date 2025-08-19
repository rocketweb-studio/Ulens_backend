import { ApiProperty } from "@nestjs/swagger";
import { BaseUserView } from "./base-user-view.dto";

export class UsersModel {
	@ApiProperty({ type: [BaseUserView] }) items: BaseUserView[];
}
