import kafka from "./kafka";
const producer = kafka.producer();

async function send() {
  await producer.connect();
  await producer.send({
    topic: "game-update",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  await producer.disconnect();
}

send();
