import { Move } from "chess.js";
import {
  DRAW_OFFERED,
  GAME_DRAW,
  GAME_OVER,
  INIT_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  TIMEOUT,
} from "../messages";

export type Result = "white" | "black" | "draw";
export type GameOverType =
  | "draw"
  | "white_timeout"
  | "black_timeout"
  | "white_resign"
  | "black_resign"
  | "white_checkmate"
  | "black_checkmate"
  | "white_stalemate"
  | "black_stalemate"
  | "threefoled_repetition"
  | "insufficient_material"
  | "fifty_move_rule"
  | "unknown";
export type GameStatus = "active" | "over";
export interface GameMove extends Move {
  time: number;
}

export interface InitGamePayload {
  t: typeof INIT_GAME;
  d: {
    id: string;
    color: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

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

//draw offer sent to a player.
export interface DrawOfferPayload {
  t: typeof DRAW_OFFERED;
  d: {
    color: "black" | "white";
  };
}

export interface GameDrawPayload {
  t: typeof GAME_DRAW;
  d: {
    winner: "draw";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface GameOverPayload {
  t: typeof GAME_OVER;
  d: {
    type: GameOverType;
    winner: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface TimeoutPayload {
  t: typeof TIMEOUT;
  d: {
    winner: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface ResignPayload {
  t: typeof RESIGN;
  d: {
    winner: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export type GameMessagePayload =
  | InitGamePayload
  | MovePayload
  | DrawOfferPayload
  | GameDrawPayload
  | GameOverPayload
  | TimeoutPayload
  | ResignPayload;
