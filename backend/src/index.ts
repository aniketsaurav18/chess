import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/auth";
import prisma from "./db";


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

checkDatabaseConnection().then(() => {
  app.get("/health-check", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/api", authRouter);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error("Error checking database connection:", err);
  process.exit(1); // Exit the process if there's an error during database connection check
});

