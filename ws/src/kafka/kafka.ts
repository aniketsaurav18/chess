import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chess-game-server",
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_HOST_PORT}`],
});

export default kafka;
