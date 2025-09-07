import { Controller, Get } from "@nestjs/common";

@Controller()
export class RedisController {
	@Get()
	getHello(): string {
		return "Redis Mock service";
	}
}
