import { kafkaInit } from "./admin";
import kafka from "./kafka";
import dotenv from "dotenv";
dotenv.config();

async function startConsumer() {
  const group = process.env.KAFKA_GROUP_ID ?? "1";
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: ["moves-update"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value?.toString()
      );
    },
  });
}

async function init() {
  await kafkaInit();
  startConsumer();
}

init();
