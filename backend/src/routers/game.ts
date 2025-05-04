import { Router, Request, Response } from "express";
import db from "../db";

const gameRouter = Router();

gameRouter.get("/:userID", async (req: Request, res: Response) => {
  const { userID } = req.params;
  const user = await db.user.findUnique({ where: { id: userID } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const games = await db.game.findMany({
    where: { OR: [{ white_player_id: userID }, { black_player_id: userID }] },

    select: {
      id: true,
      whitePlayer: {
        select: {
          username: true,
          avatar_url: true,
        },
      },
      blackPlayer: {
        select: {
          username: true,
          avatar_url: true,
        },
      },
      result: true,
      time_control: true,
      start_at: true,
      end_at: true,
    },
  });
  console.log(games);
  return res.status(200).json({ games: games });
});

export default gameRouter;
