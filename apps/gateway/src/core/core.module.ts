import { configModule } from "./env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { RedisModule } from "@libs/redis/redis.module";
import { RabbitModule } from "@libs/rabbit/index";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

@Module({
	imports: [
		configModule,
		RedisModule.forRoot(),
		RabbitModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: true,
			path: "api/v1/graphql",
			autoSchemaFile: join(process.cwd(), "apps/gateway/src/core/graphql/schema.gql"),
			sortSchema: true,
			introspection: true, // Разрешает отображение схемы в GraphQL Playground на проде
			context: ({ req, res }) => ({ req, res }),
			subscriptions: {
				"graphql-ws": {
					path: "/api/v1/graphql",
					onConnect: (ctx: any) => {
						console.log("[GATEWAY][GRAPHQL] graphql-ws protocol connected", ctx);
					},
				},
				"subscriptions-transport-ws": {
					path: "/api/v1/graphql",
					onConnect: (ctx: any) => {
						console.log("[GATEWAY][GRAPHQL] subscriptions-transport-ws protocol connected", ctx);
					},
				},
			},
			formatError: (error) => {
				return {
					message: error.message,
					originalError: error.extensions?.originalError,
				};
			},
		}),
	],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}
