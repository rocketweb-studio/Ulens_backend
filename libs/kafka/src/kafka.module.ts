import { Global, Module, OnModuleDestroy, Optional, Inject } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Kafka, Partitioners, logLevel, type Producer, type Consumer } from "kafkajs";

// ! ОЧЕНЬ ВАЖНО: все топики мы создаем руками, командами в терминале, после того как подниметься контейнер
// ! Если не примонтирован volume создавать их нужно каждый раз при запуске
// ! Делаем так потому, что прятать создание топиков в коде приложения - очень плохая практика
@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		// Kafka client
		{
			provide: "KAFKA",
			useFactory: (cfg: ConfigService) =>
				new Kafka({
					clientId: cfg.get<string>("KAFKA_CLIENT_ID") || "app",
					brokers: (cfg.get<string>("KAFKA_BROKERS") || cfg.get<string>("KAFKA_BROKER") || "localhost:9094")
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean),
					logLevel: logLevel.NOTHING,
					retry: { retries: 5 },
					requestTimeout: 30_000,
					connectionTimeout: 10_000,
				}),
			inject: [ConfigService],
		},

		// Producer (подключаем сразу)
		{
			provide: "KAFKA_PRODUCER",
			useFactory: async (kafka: Kafka) => {
				const producer = kafka.producer({
					allowAutoTopicCreation: false,
					createPartitioner: Partitioners.LegacyPartitioner,
				});
				await producer.connect();
				return producer;
			},
			inject: ["KAFKA"],
		},

		// Consumer (подключаем сразу, run() вызываете в своих listener-классах)
		{
			provide: "KAFKA_CONSUMER",
			useFactory: async (kafka: Kafka, cfg: ConfigService) => {
				const groupId = cfg.get<string>("KAFKA_GROUP_ID") || "app-consumer";
				const consumer = kafka.consumer({
					groupId,
					allowAutoTopicCreation: false,
				});
				await consumer.connect();
				return consumer;
			},
			inject: ["KAFKA", ConfigService],
		},
	],
	exports: ["KAFKA", "KAFKA_PRODUCER", "KAFKA_CONSUMER"],
})
export class KafkaModule implements OnModuleDestroy {
	constructor(
		@Optional() @Inject("KAFKA_PRODUCER") private readonly producer?: Producer,
		@Optional() @Inject("KAFKA_CONSUMER") private readonly consumer?: Consumer,
	) {}

	async onModuleDestroy() {
		try {
			await this.consumer?.disconnect();
		} catch {}
		try {
			await this.producer?.disconnect();
		} catch {}
	}
}
