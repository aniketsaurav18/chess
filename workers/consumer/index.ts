import dotenv from "dotenv";
dotenv.config();

import { Kafka } from "kafkajs";
import { Processor } from "./processor";

const Broker = process.env.KAFKA_BROKER || "localhost:9092";
const GroupId = process.env.KAFKA_GROUP_ID || "my-group";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [Broker],
});

const consumer = kafka.consumer({ groupId: GroupId });

const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({ topic: "game-update", fromBeginning: true });
    console.log("Subscribed to topic");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Message recieved");
        console.log({
          topic,
          partition,
          key: message.key ? message.key.toString() : "no key",
          value: message.value ? message.value.toString() : "no value",
        });
        const val = message.value?.toString() as string;
        await Processor(val);
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
};

const gracefulShutdown = async () => {
  try {
    console.log("Disconnecting Kafka consumer...");
    await consumer.disconnect();
    console.log("Kafka consumer disconnected.");
  } catch (error) {
    console.error("Error during consumer disconnect:", error);
  } finally {
    process.exit();
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startConsumer();
