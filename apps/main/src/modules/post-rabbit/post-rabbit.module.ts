import { Module } from "@nestjs/common";
import { EventStoreModule } from "@main/modules/event-store/event-store.module";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";
import { PostRabbitPublisher } from "./post-rabbit.publisher";

@Module({
	imports: [EventStoreModule],
	providers: [PostRabbitPublisher, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [],
})
export class PostRabbitModule {}
