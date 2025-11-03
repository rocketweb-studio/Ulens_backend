import { CurrencyEnum, PaymentIntervalEnum } from "@libs/contracts/index";

export class PayPalPlanDto {
	product_id: string;
	name: string;
	description: string;
	interval: PaymentIntervalEnum;
	price: number;
	currency: CurrencyEnum;
}
