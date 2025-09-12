// Простой продюсер KafkaJS: шлёт 3 сообщения в demo.ping.v1
// Запускаем командой node kafka-test-producer.js

const { Kafka, logLevel, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "demo-producer",
  brokers: ["localhost:9094"], // внешний listener из docker-compose
  logLevel: logLevel.WARN,
});

const TOPIC = "demo.keys.v1";

(async () => {
  const producer = kafka.producer({
    allowAutoTopicCreation: false,
    createPartitioner: Partitioners.LegacyPartitioner,
    // ^ фиксируем старое поведение распределения по партициям (как в KafkaJS < v2).
    // Партиция выбирается детерминированно по key; одинаковый key → та же партиция.
  });
  await producer.connect();
  console.log(`[producer] connected -> ${TOPIC}`);

  /* отправлял сообщения в одну партицию p0 */
  // for (let i = 0; i < 3; i++) {
  //   const payload = { hello: i, at: new Date().toISOString() };
  //   await producer.send({
  //     topic: TOPIC,
  //     messages: [{
  //       key: String(i),                 // порядок по ключу внутри партиции
  //       value: JSON.stringify(payload),
  //       headers: { 'x-trace-id': `demo-${i}` },
  //     }],
  //   });
  //   console.log(`[producer] sent #${i}`, payload);
  // }

  /* отправлял сообщения в партиции p0 и p1  */
  // const msgs = ["A", "B", "A", "C", "B", "C", "A", "B", "C"];
  // for (const k of msgs) {
  //   await producer.send({
  //     topic: TOPIC,
  //     messages: [
  //       {
  //         key: k,
  //         value: JSON.stringify({ key: k, at: new Date().toISOString() }),
  //       },
  //     ],
  //   });
  //   console.log(`[producer] sent key=${k}`);
  // }

  // Тест: отправляем по одному сообщению в каждую партицию 0,1,2
  // for (const p of [0, 1, 2]) {
  //   await producer.send({
  //     topic: TOPIC,
  //     messages: [
  //       {
  //         partition: p, // <<< ручной выбор партиции
  //         key: `P${p}`, // ключ для наглядности
  //         value: JSON.stringify({ to: `p${p}`, at: new Date().toISOString() }),
  //       },
  //     ],
  //   });
  //   console.log(`[producer] sent to partition=${p}`);
  // }

	/* В продюсере отправляем пачку с разными ключами — увидим распределение по партициям, порядок внутри каждой сохранится */ 
  await producer.send({
    topic: "demo.keys.v1",
    messages: [
      { key: "A", value: "msg-1" },
      { key: "B", value: "msg-2" },
      { key: "C", value: "msg-3" },
      { key: "A", value: "msg-4" },
    ],
  });

// 	try {
//   await producer.send({ topic: 'typo.demo.keys.v1', messages: [{ value: 'x' }]});
// } catch (e) {
//   console.error(e.type, e.message); // ожидаем UNKNOWN_TOPIC_OR_PARTITION
// }

  await producer.disconnect();
  console.log("[producer] done");
})().catch((e) => {
  console.error("[producer] error:", e);
  process.exit(1);
});
