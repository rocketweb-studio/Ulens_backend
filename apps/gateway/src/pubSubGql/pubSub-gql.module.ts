import { DynamicModule, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { PUB_SUB_GQL } from "@libs/constants/index";
import { PubSubGqlConfig } from "./pubSub-gql.config";

@Module({
	providers: [
		PubSubGqlConfig,
		{
			provide: PUB_SUB_GQL,
			useFactory: (config: PubSubGqlConfig) => {
				return new RedisPubSub({
					publisher: new Redis(config.redisUri),
					subscriber: new Redis(config.redisUri),
				});
			},
			inject: [PubSubGqlConfig],
		},
	],
	exports: [PUB_SUB_GQL],
})
export class PubSubGqlModule {
	static forRoot(config: PubSubGqlConfig): DynamicModule {
		return {
			module: PubSubGqlModule,
			providers: [
				{
					provide: PubSubGqlConfig,
					useValue: config,
				},
			],
		};
	}
}
