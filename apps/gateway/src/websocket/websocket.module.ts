import { Module } from "@nestjs/common";
import { WebsocketGateway } from "@gateway/websocket/websocket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { WebsocketEnvConfig } from "./websocket.config";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (websocketEnvConfig: WebsocketEnvConfig) => ({
				secret: websocketEnvConfig.accessTokenSecret,
			}),
			inject: [WebsocketEnvConfig],
			extraProviders: [WebsocketEnvConfig],
		}),
	],
	providers: [WebsocketGateway, WebsocketEnvConfig],
	exports: [WebsocketGateway],
})
export class WebsocketModule {}
