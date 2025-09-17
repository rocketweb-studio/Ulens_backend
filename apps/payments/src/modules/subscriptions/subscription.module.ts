import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { ISubscriptionCommandRepository } from "./subscription.interface";
import { PrismaSubscriptionCommandRepository } from "./repositories/subscription.command.repository";
// import { OutboxPublisherService } from "@payments/core/outbox/outbox-publisher.rabbit.service";
// import { RabbitEventBus } from "@libs/rabbit/index";
import { KafkaEventBus } from "@libs/kafka/kafka.event-bus";
import { OutboxPublisherKafkaService } from "@payments/core/kafka/outbox-publisher.kafka.service";

@Module({
	imports: [],
	providers: [
		{ provide: ISubscriptionCommandRepository, useClass: PrismaSubscriptionCommandRepository },
		// { provide: ISubscriptionQueryRepository, useClass: PrismaSubscriptionQueryRepository },
		SubscriptionService,
		// OutboxPublisherService,		// если используем Rabbit  switchMessageBroker**
		OutboxPublisherKafkaService, // если используем Kafka   switchMessageBroker**
		// { provide: "EVENT_BUS", useClass: RabbitEventBus },  // если используем Rabbit  switchMessageBroker**
		{ provide: "EVENT_BUS", useClass: KafkaEventBus }, // если используем Kafka   switchMessageBroker**
	],
	controllers: [SubscriptionController],
	exports: [ISubscriptionCommandRepository],
})
export class SubscriptionModule {}
