import { Kafka } from "kafkajs";
import {
  GameOverPayload,
  InitGamePayloadProducer,
  MovePayload,
} from "../types/types";

class Producer {
  private producer;
  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
  }
  async connect() {
    await this.producer.connect();
  }
  async send(
    msg: GameOverPayload | InitGamePayloadProducer | MovePayload,
    gameId: string
  ) {
    const producerMessage = JSON.stringify({ gameId: gameId, payload: msg });
    try {
      console.log("sending message to kafka: ", msg);
      await this.producer.send({
        topic: "game-update",
        messages: [
          {
            key: "moves-update",
            value: producerMessage,
          },
        ],
      });
      console.log("message sent");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }
  async disconnect() {
    await this.producer.disconnect();
  }
}

export default Producer;
