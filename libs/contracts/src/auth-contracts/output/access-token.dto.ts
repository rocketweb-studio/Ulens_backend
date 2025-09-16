import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
	@ApiProperty({
		description: "Access token of the user",
		example:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWNiMGQyYi0xZDg2LTQ1NTQtOWNiNS1hMDk4MGM5Y2Y0YmUiLCJkZXZpY2VJZCI6ImY1NWVmN2EwLTU2NWEtNDllNy05MDRkLTBmMDI2OTA2ODlhMSIsImlhdCI6MTc1ODA0Mjg2NiwiZXhwIjoxNzU4MDQ1ODY2fQ.WDpLXDGh8xZQxUKBAa5SxpnbDaKLp_DuaNRT2JzZ9r4",
	})
	accessToken: string;
}
