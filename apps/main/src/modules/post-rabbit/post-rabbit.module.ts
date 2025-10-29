import { Module } from "@nestjs/common";
import { EventStoreModule } from "@main/modules/event-store/event-store.module";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";
import { PostRabbitPublisher } from "@main/modules/post-rabbit/post-rabbit.publisher";
import { PostRabbitConsumer } from "@main/modules/post-rabbit/post-rabbit.consumer";
import { PostModule } from "@main/modules/post/post.module";
@Module({
	imports: [EventStoreModule, PostModule],
	providers: [PostRabbitPublisher, PostRabbitConsumer, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [],
})
export class PostRabbitModule {}
