import { Controller, Get } from "@nestjs/common";

@Controller()
export class PaymentsController {
	@Get()
	getHello(): string {
		return "Hello World!";
	}
}
