import { Router } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await db.user.findFirst({
    where: {
      OR: [{ email: { equals: email } }, { username: { equals: email } }],
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = createToken({ id: user.id, email: user.email }, "30d");

  res.status(200).json({
    message: "Login successful",
    name: user.name,
    userId: user.id,
    username: user.username,
    token: token,
    email: user.email,
  });
});

router.post("/signup", async (req, res) => {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(400).json({
      message:
        "Data incorrect, name, email, password, and username are required",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        username: username,
      },
    });

    const token = createToken({ id: user.id, email: user.email }, "30d");

    res.status(200).json({
      message: "Signup successful",
      token: token,
      name: user.name,
      username: user.username,
      userId: user.id,
      email: user.email,
    });
  } catch (err: any) {
    console.log(err);
    if (err.code === "P2002") {
      let message;
      if (err.meta.target[0] === "username") {
        message = "Username already exits.";
      } else if (err.meta.target[0] === "email") {
        message = "Email already exits.";
      } else {
        message = "Email or Username already exist";
      }
      return res.status(500).json({ message: message });
    }
    return res
      .status(500)
      .json({ message: "An error occurred while signing up" });
  }
});

export default router;
