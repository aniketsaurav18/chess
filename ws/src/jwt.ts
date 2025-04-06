import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: Secret = process.env.JWT_SECRET || "this_is_a_secret";

interface Payload {
  id: string;
  email: string;
  [key: string]: any;
}

const verifyToken = (token: string): Payload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as Payload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

export { verifyToken };
