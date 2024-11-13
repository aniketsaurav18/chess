import { GameOverPayload, InitGamePayload, MovePayload } from "./types/types";

// {
//     t: "init_game",
//     d: {
//       gameId: this.gameId,
//       startTime: this.startTime,
//       timeControl: this.gameTimeLimit,
//       currentFen:
//         "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
//     },
//   }

const insertMove = async (data) => {
  console.log(data);
};

const insertResult = async (data) => {
  console.log(data);
};

const insertInitGamePayload = async (data) => {
  console.log(data);
};

export const Processor = async (message: string) => {
  const data = JSON.parse(message) as
    | MovePayload
    | GameOverPayload
    | InitGamePayload;
  switch (data.t) {
    case "move": {
      await insertMove(data.d);
    }

    case "game_over": {
      await insertResult(data.d);
    }

    case "init_game": {
      await insertInitGamePayload(data.d);
    }
  }
};
