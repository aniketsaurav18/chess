import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: Secret = process.env.JWT_SECRET || "this_is_a_secret";

interface Payload {
  id: string;
  email: string;
  [key: string]: any;
}

const createToken = (
  payload: Payload,
  expiresIn: string | number = "1h"
): string => {
  const options: SignOptions = { expiresIn };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

export { createToken };
