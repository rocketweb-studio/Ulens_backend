import { Module } from "@nestjs/common";
import { EventStoreModule } from "@files/modules/event-store/event-store.module";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";
import { FilesRabbitConsumer } from "@files/modules/files-rabbit/files-rabbit.consumer";
import { FilesModule } from "@files/modules/files/files.module";

@Module({
	imports: [EventStoreModule, FilesModule],
	providers: [FilesRabbitConsumer, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [],
})
export class FilesRabbitModule {}
