import { GAME_OVER, MOVE } from "./messages.ts";

export interface MovePayload {
  t: typeof MOVE;
  d: {
    san: string;
    f: string;
    t: number;
    clock: {
      w: number;
      b: number;
    };
  };
}

export type GameOverType =
  | "draw"
  | "white_timeout"
  | "black_timeout"
  | "white_resign"
  | "black_resign"
  | "white_checkmate" //white gets checkmated by black
  | "black_checkmate" //black gets checkmated by white
  | "white_stalemate"
  | "black_stalemate"
  | "threefold_repetition"
  | "insufficient_material"
  | "fifty_move_rule"
  | "unknown";

export interface GameOverPayload {
  t: typeof GAME_OVER;
  d: {
    type: GameOverType;
    msg: string;
    winner: "draw" | "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}
