import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [`${process.env.KAFKA_HOST}:9092`],
});

export default kafka;
