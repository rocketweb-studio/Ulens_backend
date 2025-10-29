import { RabbitEventBus } from "@libs/rabbit/index";
import { Module } from "@nestjs/common";
import { RMQ_EVENT_BUS } from "@libs/rabbit/index";
import { GatewayRabbitConsumer } from "@gateway/gateway-rabbit/gateway-rabbit.consumer";
import { WebsocketModule } from "@gateway/websocket/websocket.module";

@Module({
	imports: [WebsocketModule],
	providers: [GatewayRabbitConsumer, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [GatewayRabbitConsumer],
})
export class GatewayRabbitModule {}
