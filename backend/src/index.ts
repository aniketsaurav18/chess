import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authrouter from "./routers/auth";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health-check", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", authrouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
