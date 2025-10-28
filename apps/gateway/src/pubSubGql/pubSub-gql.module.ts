import { Module } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { PUB_SUB_GQL } from "@libs/constants/index";

@Module({
	providers: [
		{
			provide: PUB_SUB_GQL,
			useValue: new PubSub(),
		},
	],
	exports: [PUB_SUB_GQL],
})
export class PubSubGqlModule {}
