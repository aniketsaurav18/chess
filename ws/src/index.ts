import { WebSocketServer } from "ws";
import { GameManager } from "./gameManager";
import Producer from "./kafka/producer";
import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

async function initKafka(): Promise<Producer> {
  try {
    const kafka = new Kafka({
      clientId: "chess-game-server",
      brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_HOST_PORT}`],
    });
    const producer = new Producer(kafka);
    await producer.connect();
    // await producer.send(JSON.stringify("hello"));
    return producer;
  } catch (e: any) {
    console.log("Error connecting to producer \n");
    throw new Error(`Error connecting to producer: ${e.message}`);
  }
}

async function startServer() {
  try {
    const producer = await initKafka();
    console.log("Producer connected.");

    const wss = new WebSocketServer({ port: 8080 });
    const gameManager = new GameManager(producer);
    console.log("Server Started....");

    wss.on("connection", function connection(ws) {
      console.log("Client connected");
      gameManager.addUser(ws);

      ws.on("close", () => {
        gameManager.removeUser(ws);
        console.log("Client disconnected");
      });
    });

    const gracefulShutdown = async () => {
      try {
        wss.close();
        console.log("WebSocket server closed.");
      } catch (error) {
        console.error("Error during shutdown:", error);
      } finally {
        process.exit(0);
      }
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (e: any) {
    console.error("Server initialization error \n");
    console.log(e);
  }
}

startServer();
