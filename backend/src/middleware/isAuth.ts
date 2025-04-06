import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: Secret = process.env.JWT_SECRET || "this_is_a_secret";

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not Authorized" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};

export { isAuth };
