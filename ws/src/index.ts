import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer } from "ws";
import { GameManager } from "./gameManager";
import Producer from "./kafka/producer";
import { Kafka } from "kafkajs";
import pool from "./db/db";

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
    throw new Error(`Error connecting to producer: ${e.message}`);
  }
}

async function checkDBConnection() {
  try {
    await pool.query("SELECT current_database(), current_user, now();");
    console.log("Database connected.");
  } catch (e: any) {
    console.log("Database connection failed.");
    throw new Error(`Error connecting to database: ${e.message}`);
  }
}

async function startServer() {
  try {
    const producer = await initKafka();
    await checkDBConnection();
    console.log("Producer connected.");

    const wss = new WebSocketServer({
      port: 8080,
      host: "0.0.0.0", // Critical for Docker
    });

    wss.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });

    console.log("Server started on ws://0.0.0.0:8080");

    const gameManager = new GameManager(producer);

    wss.on("connection", function connection(ws, req) {
      console.log(`Client connected from ${req.socket.remoteAddress}`);
      gameManager.addUser(ws);

      ws.on("close", () => {
        gameManager.removeUser(ws);
        console.log("Client disconnected");
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });

    const gracefulShutdown = async () => {
      try {
        wss.clients.forEach((client) => client.terminate());
        wss.close();
        await producer.disconnect();
        console.log("Server shut down gracefully");
      } catch (error) {
        console.error("Error during shutdown:", error);
      } finally {
        process.exit(0);
      }
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (e) {
    console.error("Server initialization error:", e);
    process.exit(1);
  }
}

startServer();
