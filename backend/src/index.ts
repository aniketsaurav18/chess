import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routers/auth";
import prisma from "./db";
import gameRouter from "./routers/game";
import { isAuth } from "./middleware/isAuth";
import userRouter from "./routers/user";

const app = express();
dotenv.config();

// Configure morgan
morgan.token("body", (req: any) => JSON.stringify(req.body));
morgan.token("response-time", (req: any, res: any) => {
  if (!res._header || !req._startAt) return "";
  const diff = process.hrtime(req._startAt);
  const time = diff[0] * 1e3 + diff[1] * 1e-6;
  return time.toFixed(2);
});

// Custom format
const customFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(customFormat));

app.get("/health-check", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);
app.use("/api/user", isAuth, userRouter);

// Check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process if unable to connect to database
  }
}

checkDatabaseConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error checking database connection:", err);
    process.exit(1); // Exit the process if there's an error during database connection check
  });

// graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed.");
  process.exit(0);
});
