import { Module } from "@nestjs/common";
import { WebsocketGateway } from "@gateway/websocket/websocket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { WebsocketEnvConfig } from "./websocket.config";
import { MessengerClientModule } from "@gateway/microservices/messenger/messenger-client.module";
import { FilesClientModule } from "@gateway/microservices/files/files-client.module";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (websocketEnvConfig: WebsocketEnvConfig) => ({
				secret: websocketEnvConfig.accessTokenSecret,
			}),
			inject: [WebsocketEnvConfig],
			extraProviders: [WebsocketEnvConfig],
		}),
		MessengerClientModule,
		FilesClientModule,
	],
	providers: [WebsocketGateway, WebsocketEnvConfig],
	exports: [WebsocketGateway],
})
export class WebsocketModule {}
