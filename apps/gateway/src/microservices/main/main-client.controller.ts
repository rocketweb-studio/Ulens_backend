import { Controller } from "@nestjs/common";
import { MainRouterPaths } from "@libs/constants/index";

@Controller(MainRouterPaths.MAIN)
export class MainClientController {
	// constructor(private readonly mainClientService: MainClientService) {}
	// @Get()
	// async getSubscriptions(): Promise<BaseSubscriptionViewDto[]> {
	// 	return this.mainClientService.getSubscriptions();
	// }
	// @Post()
	// async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<BaseSubscriptionViewDto> {
	// 	return this.mainClientService.createSubscription(createSubscriptionDto);
	// }
}
