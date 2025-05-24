import dotenv from "dotenv";
dotenv.config();

import { Consumer, Kafka } from "kafkajs";
import { Processor } from "./processor";
import { checkDBConnection } from "./db";

const Broker = process.env.KAFKA_BROKER || "localhost:9092";
const GroupId = process.env.KAFKA_GROUP_ID || "my-group";

let kafka: Kafka;
let consumer: Consumer;

const initKafka = async () => {
  try {
    kafka = new Kafka({
      clientId: "chess-game-server",
      brokers: [`${process.env.KAFKA_HOST}`],
    });
    consumer = kafka.consumer({ groupId: GroupId });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
    throw error;
  }
};

const startConsumer = async () => {
  try {
    await initKafka();
    await checkDBConnection();
    console.log("Connecting to Kafka consumer...");
    console.log("Broker", Broker);
    console.log("GroupId", GroupId);
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
