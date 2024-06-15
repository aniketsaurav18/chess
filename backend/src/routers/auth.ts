import { Router } from "express";
import db from "../db";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: email,
          },
        },
        {
          username: {
            equals: email,
          },
        },
      ],
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
  res.status(200).json({ message: "Login successful", userId: user.id });
});

router.post("/signup", async (req, res) => {
  const { email, password, userName } = req.body;
  if (!email || !password || !userName) {
    return res.status(400).send("Data Incorrect, email, password and username");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        username: userName,
      },
    });
    res.status(200).send("Signup successful");
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(500).send("Email already exists");
    }
    return res.status(500).send("An error occurred while signing up");
  }
});

export default router;
