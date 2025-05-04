import { Router, Request, Response } from "express";
import db from "../db";

const userRouter = Router();

userRouter.get("/:userID", async (req: Request, res: Response) => {
  const { userID } = req.params;
  const user = await db.user.findUnique({ where: { id: userID } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const games = await db.game.findMany({
    where: {
      OR: [{ white_player_id: userID }, { black_player_id: userID }],
    },
  });
  return res.status(200).json({
    createdAt: user.created_at,
    gamesCount: games.length,
  });
});

export default userRouter;
