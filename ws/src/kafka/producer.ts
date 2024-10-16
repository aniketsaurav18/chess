import { Kafka } from "kafkajs";

class Producer {
  private producer;
  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
  }
  async connect() {
    await this.producer.connect();
  }
  async send(msg: string) {
    try {
      console.log("sending message to kafka: ", msg);
      await this.producer.send({
        topic: "game-update",
        messages: [
          {
            key: "moves-update",
            value: msg,
          },
        ],
      });
      console.log("message sent");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }
}

export default Producer;
